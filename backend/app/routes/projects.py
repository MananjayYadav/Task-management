from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Project, User
from ..schemas import ProjectCreate, ProjectResponse


router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


# ==========================================
# CREATE PROJECT
# ==========================================

@router.post(
    "/",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED
)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db)
):
    owner = (
        db.query(User)
        .filter(User.id == project_data.owner_id)
        .first()
    )

    if not owner:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    project = Project(
        name=project_data.name,
        owner_id=project_data.owner_id
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


# ==========================================
# GET ALL PROJECTS
# ==========================================

@router.get(
    "/",
    response_model=list[ProjectResponse]
)
def get_projects(
    db: Session = Depends(get_db)
):
    return db.query(Project).all()


# ==========================================
# UPDATE PROJECT BY ID
# ==========================================

@router.put(
    "/{project_id}",
    response_model=ProjectResponse
)
def update_project(
    project_id: int,
    project_data: ProjectCreate,
    db: Session = Depends(get_db)
):
    # Find project
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Check that new owner exists
    owner = (
        db.query(User)
        .filter(User.id == project_data.owner_id)
        .first()
    )

    if not owner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Update project
    project.name = project_data.name
    project.owner_id = project_data.owner_id

    db.commit()
    db.refresh(project)

    return project


# ==========================================
# DELETE PROJECT BY ID
# ==========================================

@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    # Find project
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Delete project
    db.delete(project)
    db.commit()

    return None