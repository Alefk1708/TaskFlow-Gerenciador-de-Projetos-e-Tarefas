from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db

from core.security import get_current_user, hash_password
# ADICIONEI TwoFactorAuth e PasswordReset AOS IMPORTS
from models.models import User, Tarefa, TwoFactorAuth, PasswordReset 
from schemas.schema import UserUpdate

router = APIRouter(prefix="/user", tags=["user"])

# ... (código do update continua igual) ...

@router.delete("/delete")
def user_delete(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_db = db.query(User).filter(User.id == user.id).first()

    if not user_db:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
   
    db.query(Tarefa).filter(Tarefa.user_id == user.id).delete()

    db.query(TwoFactorAuth).filter(TwoFactorAuth.user_id == user.id).delete()

  
    db.query(PasswordReset).filter(PasswordReset.user_id == user.id).delete()

    db.delete(user_db)
    
    db.commit()

    return {"message": "Usuário deletado com sucesso"}