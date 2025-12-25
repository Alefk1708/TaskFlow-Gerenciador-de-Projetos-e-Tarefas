from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db

from core.security import get_current_user, hash_password
from models.models import User
from schemas.schema import UserUpdate

router = APIRouter(prefix="/user", tags=["user"])

@router.put("/update")
def user_update(
    payload: UserUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    user_db = db.query(User).filter(User.id == user.id).first()

    if not user_db:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if payload.name:
        user_db.name = payload.name

    if payload.email:
        email_exists = db.query(User).filter(
            User.email == payload.email,
            User.id != user.id
        ).first()

        if email_exists:
            raise HTTPException(status_code=400, detail="E-mail já está em uso")

        user_db.email = payload.email

    if payload.password:
        user_db.password_hash = hash_password(payload.password)

    db.commit()
    db.refresh(user_db)

    return {
        "message": "Usuário atualizado com sucesso",
        "data": {
            "id": user_db.id,
            "name": user_db.name,
            "email": user_db.email
        }
    }

@router.delete("/delete")
def user_delete(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_db = db.query(User).filter(User.id == user.id).first()

    if not user_db:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    db.delete(user_db)
    db.commit()

    return {"message": "Usuário deletado com sucesso"}