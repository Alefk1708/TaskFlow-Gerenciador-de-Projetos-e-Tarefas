from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from datetime import datetime
from database import Base
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)  # UUID string
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class TwoFactorAuth(Base):
    __tablename__ = "two_factor_auth"

    id = Column(String, primary_key=True, index=True)  # UUID string
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    code = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False)

class Tarefa(Base):
    __tablename__ = "tarefas"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    descricao = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    done = Column(Boolean, default=False, nullable=False)
    date = Column(DateTime, default=datetime.utcnow, nullable=False)

class PasswordReset(Base):
    __tablename__ = "password_resets"

    id = Column(String, primary_key=True, defalt=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    token_hash = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
