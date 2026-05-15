from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from .crud import create_user, create_project, create_task, add_project_members
from .models import User
from ..schemas.user import UserCreate
from ..schemas.project import ProjectCreate
from ..schemas.task import TaskCreate


def init_sample_data(db: Session):
    if db.query(User).count() > 0:
        return

    admin_create = UserCreate(name="Admin Ethara", email="admin@ethara.ai", password="Admin1234")
    member_create = UserCreate(name="Team Member", email="member@ethara.ai", password="Member1234")
    admin = create_user(db, admin_create, role="admin")
    member = create_user(db, member_create, role="member")

    project = create_project(
        db,
        ProjectCreate(
            title="Ethara AI Sprint",
            description="Launch the TaskFlow platform with live analytics and team workflows.",
            status="active",
            due_date=datetime.utcnow() + timedelta(days=14),
        ),
        owner_id=admin.id,
    )
    add_project_members(db, project, [admin.id, member.id])

    create_task(
        db,
        TaskCreate(
            title="Design dashboard UX",
            description="Create the modern glassmorphism dashboard for TaskFlow.",
            due_date=datetime.utcnow() + timedelta(days=5),
            priority="high",
            status="in progress",
            project_id=project.id,
            assignee_id=member.id,
        ),
        creator_id=admin.id,
    )

    create_task(
        db,
        TaskCreate(
            title="Set up PostgreSQL on Railway",
            description="Configure the production database and environment variables.",
            due_date=datetime.utcnow() + timedelta(days=2),
            priority="high",
            status="pending",
            project_id=project.id,
            assignee_id=admin.id,
        ),
        creator_id=admin.id,
    )
