from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID, uuid4
import uuid

class UserBase(BaseModel):
    email: str
    password: str
    
    model_config = ConfigDict(from_attributes=True)
    
class UserCreate(UserBase):
    id: UUID = Field(default_factory=lambda: str(uuid4()))
    name: str
    pass

class User(UserBase):
    pass

class TwoFactorAuth1(BaseModel):
    email: str
    code: str