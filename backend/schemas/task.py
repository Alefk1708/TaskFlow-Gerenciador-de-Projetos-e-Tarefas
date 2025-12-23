from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional


class TaskBase(BaseModel):
    title: str
    descricao: str
    priority: str
    done: bool = False

    model_config = ConfigDict(from_attributes=True)


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    descricao: Optional[str] = None
    priority: Optional[str] = None
    done: Optional[bool] = None


class TaskOut(TaskBase):
    id: UUID
    date: datetime
