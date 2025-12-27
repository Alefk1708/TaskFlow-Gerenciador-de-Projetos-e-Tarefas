from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from uuid import uuid4
from datetime import datetime, timedelta
import secrets
import os

import resend

from app.database import get_db
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.models import User, TwoFactorAuth
from app.schemas.schema import UserCreate, UserLogin, TwoFactorAuth1

router = APIRouter(prefix="/auth", tags=["auth"])

# =========================
# RESEND CONFIG
# =========================
RESEND_API_KEY = os.getenv("RESEND_API_KEY")

if not RESEND_API_KEY:
    raise RuntimeError("RESEND_API_KEY não definido")

resend.api_key = RESEND_API_KEY


# =========================
# UTILS
# =========================
def code_generator():
    code = str(secrets.randbelow(1000000)).zfill(6)
    expires = datetime.utcnow() + timedelta(minutes=10)
    return code, expires


def send_email_code(email: str, code: str, minutes: int = 5):
    try:
        brand_color = "#4F46E5" # Indigo moderno

        html_content = f"""
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Código de Confirmação</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 0;">
                        <tr>
                            <td align="center">
                                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden;">
                                    
                                    <tr>
                                        <td align="center" style="padding: 30px 40px; background-color: {brand_color};">
                                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">TaskFlow</h1>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding: 40px;">
                                            <h2 style="color: #333333; margin-top: 0; font-size: 22px; text-align: center;">Confirme sua identidade</h2>
                                            <p style="color: #666666; font-size: 16px; line-height: 1.5; text-align: center; margin-bottom: 30px;">
                                                Use o código abaixo para completar seu acesso ao <strong>TaskFlow</strong>.
                                            </p>

                                            <div style="background-color: #f0fdfa; border: 1px dashed {brand_color}; border-radius: 8px; padding: 20px; text-align: center; margin: 0 auto 30px auto; width: fit-content;">
                                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: {brand_color}; font-family: monospace;">
                                                    {code}
                                                </span>
                                            </div>

                                            <p style="color: #666666; font-size: 14px; text-align: center;">
                                                Este código expira em <strong>{minutes} minutos</strong>.
                                            </p>
                                            
                                            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">

                                            <p style="color: #999999; font-size: 13px; text-align: center; margin: 0;">
                                                Se você não solicitou este código, por favor ignore este e-mail. Ninguém da equipe TaskFlow jamais pedirá sua senha ou código por telefone.
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="background-color: #fafafa; padding: 20px; text-align: center;">
                                            <p style="color: #aaaaaa; font-size: 12px; margin: 0;">
                                                &copy; 2024 TaskFlow. Todos os direitos reservados.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """

        
        resend.Emails.send({
            "from": "TaskFlow <onboarding@resend.dev>",
            "to": [email],
            "subject": f"Seu código de acesso: {code}",
            "html": html_content,
        })
    except Exception as e:
        print("Erro ao enviar e-mail:", e)
        raise HTTPException(
            status_code=500, detail="Erro ao enviar código de verificação"
        )


# =========================
# ROUTES
# =========================
@router.post("/register")
def user_create(user: UserCreate, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.email == user.email).first()

    if user_db:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    new_user = User(
        id=str(uuid4()),
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Usuário criado com sucesso",
        "data": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
        },
    }


@router.post("/login")
def user_access(user: UserLogin, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.email == user.email).first()

    if not user_db:
        raise HTTPException(status_code=400, detail="E-mail não cadastrado")

    if not verify_password(user.password, user_db.password_hash):
        raise HTTPException(status_code=400, detail="Senha incorreta")

    code, expire = code_generator()

    twofa = TwoFactorAuth(
        id=str(uuid4()),
        user_id=user_db.id,
        code=code,
        expires_at=expire,
    )

    db.add(twofa)
    db.commit()
    db.refresh(twofa)

    send_email_code(user.email, code, 5)

    temp_token = create_access_token(
        data={"sub": str(user_db.id)},
        expires_delta=timedelta(minutes=5),
    )

    return {
        "message": "Código enviado com sucesso",
        "email": user.email,
        "temp_token": temp_token,
    }


@router.post("/verify")
def verify_code(payload: TwoFactorAuth1, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.email == payload.email).first()

    if not user_db:
        raise HTTPException(status_code=400, detail="E-mail não cadastrado")

    twofa = (
        db.query(TwoFactorAuth)
        .filter(TwoFactorAuth.user_id == user_db.id)
        .order_by(TwoFactorAuth.expires_at.desc())
        .first()
    )

    if not twofa:
        raise HTTPException(
            status_code=401, detail="Código não encontrado, faça login novamente"
        )

    if datetime.utcnow() > twofa.expires_at:
        db.delete(twofa)
        db.commit()
        raise HTTPException(
            status_code=401, detail="Código expirado, faça login novamente"
        )

    if payload.code != twofa.code:
        raise HTTPException(status_code=401, detail="Código inválido")

    db.delete(twofa)
    db.commit()

    access_token = create_access_token(
        data={
            "sub": str(user_db.id),
            "name": user_db.name,
            "email": user_db.email,
        }
    )

    return {"type": "bearer", "token": access_token}
