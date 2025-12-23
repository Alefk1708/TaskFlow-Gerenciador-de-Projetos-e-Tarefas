from fastapi import APIRouter, Depends, HTTPException
from database import Base, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import uuid

from core.security import get_current_user, create_access_token, hash_password, verify_password
from models.models import User, Tarefa
from schemas.task import TaskBase, TaskCreate, TaskUpdate, TaskOut
from schemas.schema import UserCreate, UserBase

router = APIRouter(prefix="/task", tags=["task"])

@router.post("/create/{user_id}", response_model=TaskOut)
def task_create(
    user_id: str,
    task: TaskCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    
    if (user_id != user.id):
        raise HTTPException(status_code=403, detail="Você não tem permissão para criar tarefas para este usuário")
    
    new_task = Tarefa(
        title=task.title,
        descricao=task.descricao,
        priority=task.priority,
        user_id=user_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

@router.get("/list/{user_id}", response_model=list[TaskOut])
def task_list(
    user_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    
    tasks = db.query(Tarefa).filter(Tarefa.user_id == user.id).all()

    return tasks

@router.put("/update/{task_id}", response_model=TaskOut)
def task_update(
    task_id: str,
    task: TaskUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
  
    db_task = (
        db.query(Tarefa)
        .filter(
            Tarefa.id == task_id,
            Tarefa.user_id == user.id
        )
        .first()
    )

    if not db_task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")

    for field, value in task.model_dump(exclude_unset=True).items():
        setattr(db_task, field, value)

    db.commit()
    db.refresh(db_task)

    return db_task

@router.delete("/delete/{task_id}", response_model=TaskOut)
def task_delete(
    task_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    db_task = (
        db.query(Tarefa)
        .filter(
            Tarefa.id == task_id,
            Tarefa.user_id == user.id
        )
        .first()
    )

    db.delete(db_task)
    db.commit()

    return db_task