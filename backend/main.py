from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models

from app.routes import users, projects, tasks, statistics
import time


load_dotenv()
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Task Management API",
    description="A simple task management API built with FastAPI and SQLAlchemy.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ],
    allow_headers=[
        "Content-Type",
        "Authorization"
    ],
)

@app.middleware("http")
async def log_requests(request, call_next):
    start_time = time.perf_counter()

    response = await call_next(request)

    process_time = (time.perf_counter() - start_time) * 1000

    print(
        f"{request.method} "
        f"{request.url.path} "
        f"{process_time:.2f} ms"
    )

    return response

app.include_router(users.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(statistics.router)


@app.get("/")
def root():
    return {
        "message": "Task Management API is running!"
    }
