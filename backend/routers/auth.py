from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from uuid import uuid4
from datetime import datetime, timedelta
import secrets
import smtplib
import os
import resend
import secrets
import hashlib
from dotenv import load_dotenv
load_dotenv()

from email.mime.text import MIMEText
from core.security import get_current_user, create_access_token, hash_password, verify_password
from models.models import User, TwoFactorAuth, PasswordReset
from schemas.schema import UserCreate, UserBase, TwoFactorAuth1, ResendCode, ForgotPassword, ResetPassword

router = APIRouter(prefix="/auth", tags=["auth"])

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_email_smtp(to_email: str, subject: str, html: str):
    msg = MIMEText(html, "html")
    msg["Subject"] = subject
    msg["From"] = f"TaskFlow <{SMTP_EMAIL}>"
    msg["To"] = to_email

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
    except Exception as e:
        print("Erro ao enviar email SMTP:", e)
        raise


def code_generator():
    codigo = str(secrets.randbelow(1000000)).zfill(6)
    expira = datetime.utcnow() + timedelta(minutes=10)
    return codigo, expira

def generate_reset_token():
    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    return token, token_hash


def seed_email_code(email: str, code: str, minutes: int):
    html = f"""
    <html>
      <body style="margin:0;padding:0;background:#0b1020;font-family:Arial,sans-serif;">
        <div style="max-width:520px;margin:40px auto;background:#0f1733;
                    border-radius:14px;padding:24px;color:#fff;">
          
          <h2 style="margin-top:0;">Código de confirmação</h2>

          <p style="color:#cbd5e1;">
            Use o código abaixo para continuar. Ele expira em
            <strong>{minutes} minutos</strong>.
          </p>

          <div style="
            margin:24px 0;
            padding:16px;
            background:#111827;
            border-radius:10px;
            text-align:center;
            font-size:32px;
            letter-spacing:6px;
            font-weight:bold;">
            {code}
          </div>

          <p style="font-size:12px;color:#94a3b8;">
            Se você não solicitou este código, ignore este e-mail.
          </p>

        </div>
      </body>
    </html>
    """

    send_email_smtp(
        to_email=email,
        subject="Seu código de confirmação",
        html=html
    )

    
def seed_email_reset(email: str, link: str, minutes: int):
    html = f"""
    <html>
      <body style="margin:0;padding:0;background:#0b1020;font-family:Arial,sans-serif;">
        <div style="max-width:520px;margin:40px auto;background:#0f1733;
                    border-radius:14px;padding:24px;color:#fff;">
          
          <h2 style="margin-top:0;">Redefinição de senha</h2>

          <p style="color:#cbd5e1;">
            Recebemos uma solicitação para redefinir sua senha.
            O link abaixo é válido por <strong>{minutes} minutos</strong>.
          </p>

          <a href="{link}"
             style="
               display:inline-block;
               margin:24px 0;
               padding:14px 22px;
               background:#2563eb;
               color:#fff;
               text-decoration:none;
               border-radius:8px;
               font-weight:bold;">
            Redefinir senha
          </a>

          <p style="font-size:12px;color:#94a3b8;">
            Se você não solicitou a redefinição, ignore este e-mail.
          </p>

        </div>
      </body>
    </html>
    """

    send_email_smtp(
        to_email=email,
        subject="Recuperação de senha",
        html=html
    )


    
@router.post("/register")
def user_create(user: UserCreate, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.email == user.email).first()
    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
        id=str(uuid4())
    )
    if user_db:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Usuario criado com sucesso", "data": {"name": new_user.name, "email": new_user.email, "id": new_user.id}}

@router.post("/login")
def user_acess(user: UserBase, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.email == user.email).first()

    if not user_db:
        raise HTTPException(status_code=400, detail="E-mail não cadastrado")
    
    if not verify_password(user.password, user_db.password_hash):
        raise HTTPException(status_code=400, detail="Senha incorreta")
    
    code, expire = code_generator()
    new_two_factor_auth = TwoFactorAuth(
        user_id=user_db.id,
        code=code,
        expires_at=expire,
        id=str(uuid4())
    )
    db.add(new_two_factor_auth)
    db.commit()
    db.refresh(new_two_factor_auth)
    seed_email_code(user.email, code, 5)
    token = create_access_token(data={"sub": str(user_db.id)}, expires_delta=timedelta(minutes=30))
                                
    return {"message": f"Código enviado com sucesso","email": user.email, "data": token}

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
        raise HTTPException(status_code=401, detail="Código não encontrado, faça login novamente")
    
    if datetime.utcnow() > twofa.expires_at:
        db.delete(twofa)
        db.commit()
        raise HTTPException(status_code=401, detail="Código expirado, faça login novamente")
    
    if payload.code != twofa.code:
        raise HTTPException(status_code=401, detail="Código invalido")
    
    db.delete(twofa)
    db.commit()

    acess_token = create_access_token(data={"sub": str(user_db.id), "name": user_db.name, "email": user_db.email})

    return {"type": "bearer", "token": acess_token}

@router.post("/resend-code")
def resend_code(payload: ResendCode, db: Session = Depends(get_db), user: User = Depends(get_current_user) ):
    user_db = db.query(User).filter(User.email == payload.email).first()

    if not user_db:
        return {"message": "Se o e-mail existir, um código será enviado"}

    db.query(TwoFactorAuth).filter(
        TwoFactorAuth.user_id == user_db.id
    ).delete()
    db.commit()

    code, expire = code_generator()

    twofa = TwoFactorAuth(
        id=str(uuid4()),
        user_id=user_db.id,
        code=code,
        expires_at=expire
    )

    db.add(twofa)
    db.commit()

    seed_email_code(user_db.email, code, 5)

    return {"message": "Se o e-mail existir, um código será enviado"}

@router.post("/forgot-password")
def forgot_password(payload: ForgotPassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    # Sempre responde igual (anti enumeração)
    if not user:
        return {"message": "Se o e-mail existir, enviaremos instruções para recuperação"}

    # Limpa tokens antigos
    db.query(PasswordReset).filter(
        PasswordReset.user_id == user.id
    ).delete()
    db.commit()

    token, token_hash = generate_reset_token()

    reset = PasswordReset(
        id=str(uuid4()),
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.utcnow() + timedelta(minutes=30)
    )

    db.add(reset)
    db.commit()

    reset_link = f"https://taskflow1708.netlify.app/resetar-senha?token={token}"

    seed_email_reset(
        user.email,
        reset_link,
        30
    )

    return {"message": "Se o e-mail existir, enviaremos instruções para recuperação"}

@router.post("/reset-password")
def reset_password(payload: ResetPassword, db: Session = Depends(get_db)):
    # Hash do token recebido
    token_hash = hashlib.sha256(payload.token.encode()).hexdigest()

    reset = db.query(PasswordReset).filter(
        PasswordReset.token_hash == token_hash
    ).first()

    if not reset:
        raise HTTPException(
            status_code=400,
            detail="Token inválido ou expirado"
        )

    if datetime.utcnow() > reset.expires_at:
        db.delete(reset)
        db.commit()
        raise HTTPException(
            status_code=400,
            detail="Token expirado"
        )

    user = db.query(User).filter(
        User.id == reset.user_id
    ).first()

    if not user:
        db.delete(reset)
        db.commit()
        raise HTTPException(
            status_code=400,
            detail="Usuário não encontrado"
        )

    # Atualiza senha
    user.password_hash = hash_password(payload.new_password)

    # Token de uso único → apaga
    db.delete(reset)
    db.commit()

    return {
        "message": "Senha redefinida com sucesso"
    }
