from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID, uuid4


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

# 2FA
class TwoFactorAuth1(BaseModel):
    email: str
    code: str
