from pydantic import BaseModel, Field, ConfigDict, EmailStr
from uuid import UUID, uuid4
from typing import Optional


# Base sem senha
class UserBase(BaseModel):
    email: str
    password: str

    model_config = ConfigDict(from_attributes=True)

# Entrada (criação)
class UserCreate(BaseModel):
    email: str
    name: str
    password: str

# Saída (resposta da API)
class UserOut(UserBase):
    id: UUID

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

# 2FA
class TwoFactorAuth1(BaseModel):
    email: str
    code: str
