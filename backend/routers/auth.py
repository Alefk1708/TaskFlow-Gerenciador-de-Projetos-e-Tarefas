from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from uuid import uuid4
from datetime import datetime, timedelta
import secrets
import smtplib
import os
import secrets
import hashlib
from dotenv import load_dotenv
load_dotenv()

from email.mime.text import MIMEText
from core.security import get_current_user, create_access_token, hash_password, verify_password
from models.models import User, TwoFactorAuth, PasswordReset
from schemas.schema import UserCreate, UserBase, TwoFactorAuth1, ResendCode, ForgotPassword

router = APIRouter(prefix="/auth", tags=["auth"])

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))

def code_generator():
    codigo = str(secrets.randbelow(1000000)).zfill(6)
    expira = datetime.utcnow() + timedelta(minutes=10)
    return codigo, expira

def generate_reset_token():
    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    return token, token_hash


def seed_email_code(email: str, code: str, minutes = 5):
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        raise Exception("SMTP_EMAIL and SMTP_PASSWORD environment variables must be set")
    
    corpo_html = f"""
        <!doctype html>
        <html lang="pt-BR">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <meta name="x-apple-disable-message-reformatting" />
            <title>TaskFlow • Código de confirmação</title>
        </head>

        <body style="margin:0; padding:0; background:#0b1020;">
            <!-- Preheader -->
            <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
            Seu código de confirmação do TaskFlow é {code}. Ele expira em {minutes} minutos.
            </div>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b1020; padding:24px 12px;">
            <tr>
                <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px;">

                    <tr>
                    <td style="
                        background:#0f1733;
                        border-radius:18px;
                        border:1px solid rgba(255,255,255,0.10);
                        box-shadow:0 18px 60px rgba(0,0,0,0.40);
                        overflow:hidden;
                    ">
                        <!-- Top gradient -->
                        <div style="height:8px; background:linear-gradient(90deg, #7c3aed, #06b6d4, #22c55e);"></div>

                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:28px 26px 12px 26px;">
                        <tr>
                            <td style="font-family:Arial, Helvetica, sans-serif;">
                            <h1 style="margin:0 0 10px 0; font-size:22px; line-height:1.2; color:#ffffff;">
                                Código de confirmação
                            </h1>

                            <p style="margin:0 0 18px 0; font-size:14px; line-height:1.6; color:rgba(255,255,255,0.78);">
                                Use o código abaixo para confirmar sua ação no
                                <strong style="color:#ffffff;">TaskFlow</strong>.
                            </p>

                            <!-- Code box -->
                            <div style="
                                margin:18px 0 14px 0;
                                padding:18px 16px;
                                border-radius:14px;
                                background:rgba(255,255,255,0.06);
                                border:1px solid rgba(255,255,255,0.14);
                                text-align:center;
                            ">
                                <div style="font-size:12px; letter-spacing:0.6px; color:rgba(255,255,255,0.70); margin-bottom:10px;">
                                SEU CÓDIGO
                                </div>

                                <div style="
                                font-size:34px;
                                letter-spacing:8px;
                                font-weight:800;
                                color:#ffffff;
                                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
                                ">
                                {code}
                                </div>

                                <div style="margin-top:12px; font-size:12px; color:rgba(255,255,255,0.65);">
                                Expira em <strong style="color:#ffffff;">{minutes}</strong> minutos
                                </div>
                            </div>

                            <p style="margin:14px 0 0 0; font-size:12px; line-height:1.6; color:rgba(255,255,255,0.62);">
                                Se você não solicitou este código, ignore este e-mail.
                                Por segurança, não compartilhe este código.
                            </p>
                            </td>
                        </tr>
                        </table>

                        <div style="height:1px; background:rgba(255,255,255,0.10); margin:14px 0;"></div>

                        <!-- Footer -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:0 26px 22px 26px;">
                        <tr>
                            <td style="font-family:Arial, Helvetica, sans-serif; font-size:11px; color:rgba(255,255,255,0.45); line-height:1.6;">
                            © TaskFlow • Mensagem automática, não responda.
                            </td>
                        </tr>
                        </table>

                    </td>
                    </tr>

                    <tr>
                    <td align="center" style="padding:14px 8px 0 8px; font-family:Arial, Helvetica, sans-serif;">
                        <div style="font-size:11px; color:rgba(255,255,255,0.40); line-height:1.6;">
                        Este e-mail foi enviado por motivos de segurança.
                        </div>
                    </td>
                    </tr>

                </table>
                </td>
            </tr>
            </table>
        </body>
        </html>
        """
    
   

    msg = MIMEText(corpo_html, 'html')
    msg['Subject'] = 'Código de confirmação'
    msg['From'] = SMTP_EMAIL
    msg['To'] = email

 
    
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print("Erro SMTP:", e)
        raise Exception("Falha ao enviar o e-mail.")
    
def seed_email_reset(email: str, link: str, minutes = 30):
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        raise Exception("SMTP_EMAIL and SMTP_PASSWORD environment variables must be set")
    
    corpo_html = f"""
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TaskFlow • Redefinição de senha</title>
</head>

<body style="margin:0; padding:0; background:#0b1020; font-family:Arial, Helvetica, sans-serif;">
  <!-- Preheader -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    Redefina sua senha no TaskFlow. O link expira em {minutes} minutos.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1020; padding:24px 12px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">
          <tr>
            <td style="
              background:#0f1733;
              border-radius:18px;
              border:1px solid rgba(255,255,255,0.10);
              box-shadow:0 18px 60px rgba(0,0,0,0.40);
              overflow:hidden;
            ">
              <!-- Top gradient -->
              <div style="height:8px; background:linear-gradient(90deg,#7c3aed,#06b6d4,#22c55e);"></div>

              <table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 26px;">
                <tr>
                  <td>
                    <h1 style="margin:0 0 12px 0; font-size:22px; color:#ffffff;">
                      Redefinição de senha
                    </h1>

                    <p style="margin:0 0 18px 0; font-size:14px; line-height:1.6; color:rgba(255,255,255,0.78);">
                      Recebemos uma solicitação para redefinir a senha da sua conta no
                      <strong style="color:#ffffff;">TaskFlow</strong>.
                    </p>

                    <p style="margin:0 0 22px 0; font-size:14px; line-height:1.6; color:rgba(255,255,255,0.78);">
                      Clique no botão abaixo para criar uma nova senha. Este link é válido por
                      <strong style="color:#ffffff;">{minutes} minutos</strong>.
                    </p>

                    <!-- Button -->
                    <div style="text-align:center; margin:26px 0;">
                      <a href="{link}"
                        style="
                          display:inline-block;
                          padding:14px 26px;
                          border-radius:14px;
                          background:linear-gradient(135deg,#7c3aed,#06b6d4);
                          color:#ffffff;
                          text-decoration:none;
                          font-weight:700;
                          font-size:14px;
                        ">
                        Redefinir senha
                      </a>
                    </div>

                    <!-- Fallback link -->
                    <p style="margin:20px 0 0 0; font-size:12px; line-height:1.6; color:rgba(255,255,255,0.60);">
                      Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
                    </p>

                    <p style="
                      word-break:break-all;
                      margin:8px 0 0 0;
                      font-size:12px;
                      color:#22d3ee;
                    ">
                      {link}
                    </p>

                    <p style="margin:20px 0 0 0; font-size:12px; line-height:1.6; color:rgba(255,255,255,0.60);">
                      Se você não solicitou a redefinição de senha, ignore este e-mail.
                      Sua conta continuará segura.
                    </p>
                  </td>
                </tr>
              </table>

              <div style="height:1px; background:rgba(255,255,255,0.10); margin:0 26px;"></div>

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:18px 26px;">
                <tr>
                  <td style="font-size:11px; color:rgba(255,255,255,0.45);">
                    © TaskFlow • Mensagem automática, não responda este e-mail.
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
    
    msg = MIMEText(corpo_html, 'html')
    msg['Subject'] = 'Recuperação de senha'
    msg['From'] = SMTP_EMAIL
    msg['To'] = email

 
    
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print("Erro SMTP:", e)
        raise Exception("Falha ao enviar o e-mail.")

    
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

    reset_link = f"https://taskflow1708.netlify.app/reset-password?token={token}"

    seed_email_reset(
        user.email,
        reset_link,
        30
    )

    return {"message": "Se o e-mail existir, enviaremos instruções para recuperação"}


    