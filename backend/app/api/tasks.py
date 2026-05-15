from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.dependencies import get_db, get_current_active_user, get_current_admin_user
from ..db import crud
from ..schemas.task import TaskCreate, TaskUpdate, TaskRead, CommentCreate, CommentRead

router = APIRouter()


@router.post("/", response_model=TaskRead)
def create_task(task_create: TaskCreate, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    return crud.create_task(db, task_create, creator_id=current_user.id)


@router.get("/", response_model=List[TaskRead])
def read_tasks(skip: int = 0, limit: int = 100, status: str | None = None, search: str | None = None, assignee_id: int | None = None, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    tasks = crud.get_tasks(db, skip=skip, limit=limit, status=status, search=search, assignee_id=assignee_id)
    if current_user.role == "admin":
        return tasks
    return [task for task in tasks if task.assignee_id == current_user.id or current_user in task.project.members]


@router.get("/{task_id}", response_model=TaskRead)
def read_task(task_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if current_user.role != "admin" and task.assignee_id != current_user.id and current_user not in task.project.members:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return task


@router.patch("/{task_id}", response_model=TaskRead)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if current_user.role != "admin" and task.assignee_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only assignee or admin can update tasks")
    return crud.update_task(db, task, task_update)


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    crud.delete_task(db, task)
    return {"detail": "Task deleted"}


@router.post("/{task_id}/comments", response_model=CommentRead)
def add_comment(task_id: int, comment_create: CommentCreate, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.assignee_id != current_user.id and current_user.role != "admin" and current_user not in task.project.members:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot comment on this task")
    return crud.create_comment(db, comment_create, author_id=current_user.id)
