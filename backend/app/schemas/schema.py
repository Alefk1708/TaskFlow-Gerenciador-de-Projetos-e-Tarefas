from pydantic import BaseModel, ConfigDict, EmailStr
from uuid import UUID
from typing import Optional


# Base
class UserBase(BaseModel):
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Entrada (criação)
class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str


# Saída (resposta da API)
class UserOut(UserBase):
    id: UUID
    name: str


# Atualização
class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


# 2FA
class TwoFactorAuth1(BaseModel):
    email: EmailStr
    code: str
