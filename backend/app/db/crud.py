from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session

from .models import User, Project, Task, Comment
from ..core.security import get_password_hash, verify_password
from ..schemas.user import UserCreate, UserUpdate
from ..schemas.project import ProjectCreate, ProjectUpdate
from ..schemas.task import TaskCreate, TaskUpdate
from ..schemas.comment import CommentCreate


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user_create: UserCreate, role: str = "member") -> User:
    hashed_password = get_password_hash(user_create.password)
    user = User(
        name=user_create.name,
        email=user_create.email,
        hashed_password=hashed_password,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user_role(db: Session, user: User, role: str) -> User:
    user.role = role
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()


def create_project(db: Session, project_create: ProjectCreate, owner_id: int) -> Project:
    project = Project(
        title=project_create.title,
        description=project_create.description,
        status=project_create.status,
        due_date=project_create.due_date,
        owner_id=owner_id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    if project_create.member_ids:
        add_project_members(db, project, project_create.member_ids)
    return project


def update_project(db: Session, project: Project, project_update: ProjectUpdate) -> Project:
    for field, value in project_update.dict(exclude_unset=True).items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: Project) -> None:
    db.delete(project)
    db.commit()


def add_project_members(db: Session, project: Project, user_ids: List[int]) -> Project:
    from .models import User
    members = db.query(User).filter(User.id.in_(user_ids)).all()
    project.members = members
    db.commit()
    db.refresh(project)
    return project


def get_project(db: Session, project_id: int) -> Optional[Project]:
    return db.query(Project).filter(Project.id == project_id).first()


def get_projects(db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> List[Project]:
    query = db.query(Project)
    if search:
        query = query.filter(Project.title.ilike(f"%{search}%"))
    return query.offset(skip).limit(limit).all()


def create_task(db: Session, task_create: TaskCreate, creator_id: int) -> Task:
    task = Task(
        title=task_create.title,
        description=task_create.description,
        due_date=task_create.due_date,
        priority=task_create.priority,
        status=task_create.status,
        project_id=task_create.project_id,
        assignee_id=task_create.assignee_id,
        creator_id=creator_id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_task(db: Session, task_id: int) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id).first()


def get_tasks(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None, search: Optional[str] = None, assignee_id: Optional[int] = None) -> List[Task]:
    query = db.query(Task)
    if status:
        query = query.filter(Task.status == status)
    if assignee_id:
        query = query.filter(Task.assignee_id == assignee_id)
    if search:
        query = query.filter(Task.title.ilike(f"%{search}%"))
    return query.offset(skip).limit(limit).all()


def update_task(db: Session, task: Task, task_update: TaskUpdate) -> Task:
    for field, value in task_update.dict(exclude_unset=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()


def create_comment(db: Session, comment_create: CommentCreate, author_id: int) -> Comment:
    comment = Comment(
        content=comment_create.content,
        task_id=comment_create.task_id,
        author_id=author_id,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def get_dashboard_stats(db: Session, current_user: User) -> dict:
    total_projects = db.query(Project).count()
    total_users = db.query(User).count()
    completed_tasks = db.query(Task).filter(Task.status == "completed").count()
    pending_tasks = db.query(Task).filter(Task.status != "completed").count()
    overdue_tasks = db.query(Task).filter(Task.due_date < datetime.utcnow(), Task.status != "completed").count()

    if current_user.role == "admin":
        return {
            "total_projects": total_projects,
            "total_users": total_users,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "overdue_tasks": overdue_tasks,
        }

    assigned_tasks = db.query(Task).filter(Task.assignee_id == current_user.id).all()
    completed = len([task for task in assigned_tasks if task.status == "completed"])
    upcoming = len([task for task in assigned_tasks if task.due_date and task.due_date > datetime.utcnow()])
    return {
        "assigned_tasks": len(assigned_tasks),
        "completed_tasks": completed,
        "upcoming_deadlines": upcoming,
        "progress": round(completed / max(len(assigned_tasks), 1) * 100, 1),
    }
