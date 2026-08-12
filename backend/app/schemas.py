from datetime import date

from pydantic import BaseModel, ConfigDict, Field, field_validator


# =========================
# User Schemas
# =========================

class UserCreate(BaseModel):
    name: str
    email: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    model_config = ConfigDict(from_attributes=True)


# =========================
# Project Schemas
# =========================

class ProjectCreate(BaseModel):
    name: str
    owner_id: int


class ProjectResponse(BaseModel):
    id: int
    name: str
    owner_id: int

    model_config = ConfigDict(from_attributes=True)


# =========================
# Task Schemas
# =========================

class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    status: str = "pending"

    priority: str = Field(
        default="medium",
        pattern="^(low|medium|high)$"
    )

    due_date: date | None = None
    project_id: int

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str):
        if not value.strip():
            raise ValueError("Title cannot be blank")

        return value.strip()


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None

    priority: str | None = Field(
        default=None,
        pattern="^(low|medium|high)$"
    )

    due_date: date | None = None
    project_id: int | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str | None):
        if value is not None and not value.strip():
            raise ValueError("Title cannot be blank")

        return value.strip() if value else value


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    priority: str
    due_date: date | None
    project_id: int

    model_config = ConfigDict(from_attributes=True)


class QuickAddRequest(BaseModel):
    description: str
    project_id: int

    @field_validator("description")
    @classmethod
    def validate_description(cls, value):
        if not value.strip():
            raise ValueError("Description cannot be blank")

        return value


class QuickAddResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    priority: str
    due_date: date | None
    project_id: int

    class Config:
        from_attributes = True