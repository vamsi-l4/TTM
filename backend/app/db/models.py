from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table, Enum
from sqlalchemy.orm import relationship

from .base import Base

project_member_association = Table(
    "project_member_association",
    Base.metadata,
    Column("project_id", ForeignKey("projects.id"), primary_key=True),
    Column("user_id", ForeignKey("users.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    hashed_password = Column(String(256), nullable=False)
    role = Column(String(20), default="member", nullable=False)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    assigned_tasks = relationship("Task", back_populates="assignee")
    created_projects = relationship("Project", back_populates="owner")
    comments = relationship("Comment", back_populates="author")
    projects = relationship("Project", secondary=project_member_association, back_populates="members")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(180), nullable=False)
    description = Column(Text, default="")
    status = Column(String(40), default="planning")
    due_date = Column(DateTime, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="created_projects")
    tasks = relationship("Task", back_populates="project", cascade="all, delete")
    members = relationship("User", secondary=project_member_association, back_populates="projects")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(180), nullable=False)
    description = Column(Text, default="")
    due_date = Column(DateTime, nullable=True)
    priority = Column(String(20), default="medium")
    status = Column(String(30), default="pending")
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="assigned_tasks", foreign_keys=[assignee_id])
    creator = relationship("User", foreign_keys=[creator_id])
    comments = relationship("Comment", back_populates="task", cascade="all, delete")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    task = relationship("Task", back_populates="comments")
    author = relationship("User", back_populates="comments")
