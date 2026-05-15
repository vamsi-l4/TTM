from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..core.dependencies import get_db, get_current_active_user
from ..db.crud import get_dashboard_stats
from ..schemas.dashboard import AdminDashboard, MemberDashboard

router = APIRouter()


@router.get("/", response_model=AdminDashboard | MemberDashboard)
def dashboard_stats(db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    return get_dashboard_stats(db, current_user)
