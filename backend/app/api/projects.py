from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.dependencies import get_db, get_current_active_user, get_current_admin_user
from ..db import crud
from ..schemas.project import ProjectCreate, ProjectUpdate, ProjectRead
from ..db.models import Project

router = APIRouter()


@router.post("/", response_model=ProjectRead)
def create_project(project_create: ProjectCreate, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    return crud.create_project(db, project_create, owner_id=current_user.id)


@router.get("/", response_model=List[ProjectRead])
def read_projects(skip: int = 0, limit: int = 50, search: str | None = None, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    if current_user.role == "admin":
        return crud.get_projects(db, skip=skip, limit=limit, search=search)
    user_project_ids = [project.id for project in current_user.projects]
    return [project for project in crud.get_projects(db, skip=skip, limit=limit, search=search) if project.id in user_project_ids]


@router.get("/{project_id}", response_model=ProjectRead)
def read_project(project_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    if current_user.role != "admin" and current_user not in project.members:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return project


@router.patch("/{project_id}", response_model=ProjectRead)
def edit_project(project_id: int, project_update: ProjectUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    updated = crud.update_project(db, project, project_update)
    if project_update.member_ids is not None:
        updated = crud.add_project_members(db, project, project_update.member_ids)
    return updated


@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    crud.delete_project(db, project)
    return {"detail": "Project removed"}
