from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Project, Task
from ..schemas import TaskCreate, TaskResponse, TaskUpdate,QuickAddRequest, QuickAddResponse
from ..algorithms import (
    insertion_sort,
    binary_search,
    linear_search,
)
from ..ai_parser import parse_task_description


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


PRIORITY_ORDER = {
    "low": 1,
    "medium": 2,
    "high": 3,
}


# =========================
# Create Task
# =========================

@router.post(
    "/",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED
)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db)
):
    project = (
        db.query(Project)
        .filter(Project.id == task_data.project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
        due_date=task_data.due_date,
        project_id=task_data.project_id
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


# =========================
# Get All Tasks
# =========================

@router.get("/")
def get_tasks(
    sort: str | None = Query(default=None),
    db: Session = Depends(get_db)
):
    tasks = db.query(Task).all()

    if sort == "priority":
        insertion_sort(
            tasks,
            key=lambda task: PRIORITY_ORDER.get(
                task.priority,
                2
            )
        )

    return tasks

# =========================
# Get Task By ID
# =========================

@router.get(
    "/{task_id}",
    response_model=TaskResponse
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task


# =========================
# Update Task
# =========================

@router.put(
    "/{task_id}",
    response_model=TaskResponse
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db)
):
    task = (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    update_data = task_data.model_dump(
        exclude_unset=True
    )

    if "project_id" in update_data:
        project = (
            db.query(Project)
            .filter(Project.id == update_data["project_id"])
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return task


# =========================
# Delete Task
# =========================

@router.delete(
    "/{task_id}"
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }


@router.get("/search")
def search_tasks(
    title: str,
    algo: str = "linear",
    db: Session = Depends(get_db)
):
    tasks = db.query(Task).all()

    title = title.strip()

    if not title:
        return []


    # Linear search

    if algo == "linear":

        index = linear_search(
            tasks,
            title.lower(),
            key=lambda task: task.title.lower()
        )

        if index == -1:
            return []

        return [tasks[index]]


    # Binary search

    if algo == "binary":

        insertion_sort(
            tasks,
            key=lambda task: task.title.lower()
        )

        index = binary_search(
            tasks,
            title.lower(),
            key=lambda task: task.title.lower()
        )

        if index == -1:
            return []

        return [tasks[index]]


    raise HTTPException(
    status_code=400,
    detail="algo must be 'linear' or 'binary'"
)

@router.post(
    "/quick-add",
    response_model=QuickAddResponse,
    status_code=status.HTTP_201_CREATED
)
def quick_add_task(
    data: QuickAddRequest,
    db: Session = Depends(get_db)
):
    # -------------------------
    # Check project
    # -------------------------

    project = (
        db.query(Project)
        .filter(Project.id == data.project_id)
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # -------------------------
    # Parse description
    # -------------------------

    parsed = parse_task_description(data.description)

    # -------------------------
    # Create task
    # -------------------------

    task = Task(
        title=parsed["title"],
        description=data.description,
        status="pending",
        priority=parsed["priority"],
        due_date=parsed["due_date"],
        project_id=data.project_id,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task