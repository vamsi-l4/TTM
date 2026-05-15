from pydantic import BaseModel


class AdminDashboard(BaseModel):
    total_projects: int
    total_users: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int


class MemberDashboard(BaseModel):
    assigned_tasks: int
    completed_tasks: int
    upcoming_deadlines: int
    progress: float
