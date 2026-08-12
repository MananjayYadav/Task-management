from fastapi import APIRouter, Depends
from sqlalchemy import func, case
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Project, Task


router = APIRouter(
    prefix="/statistics",
    tags=["Statistics"]
)


@router.get("/projects")
def project_statistics(
    db: Session = Depends(get_db)
):
    results = (
        db.query(
            Project.id.label("project_id"),
            Project.name.label("project_name"),

            # Total tasks
            func.count(Task.id).label("total_tasks"),

            # Pending tasks
            func.sum(
                case(
                    (Task.status == "pending", 1),
                    else_=0
                )
            ).label("pending_tasks"),

            # In-progress tasks
            func.sum(
                case(
                    (Task.status == "in_progress", 1),
                    else_=0
                )
            ).label("in_progress_tasks"),

            # Completed tasks
            func.sum(
                case(
                    (Task.status == "completed", 1),
                    else_=0
                )
            ).label("completed_tasks"),
        )
        .outerjoin(
            Task,
            Project.id == Task.project_id
        )
        .group_by(
            Project.id,
            Project.name
        )
        .all()
    )

    return [
        {
            "project_id": row.project_id,
            "project_name": row.project_name,
            "total_tasks": row.total_tasks,
            "pending_tasks": row.pending_tasks or 0,
            "in_progress_tasks": row.in_progress_tasks or 0,
            "completed_tasks": row.completed_tasks or 0,
        }
        for row in results
    ]