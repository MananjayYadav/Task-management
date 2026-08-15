# Task flow management

A full-stack task management application built with FastAPI, SQLAlchemy, SQLite, JavaScript, HTML, and CSS.

## Features

* User management
* Project management
* Task CRUD operations
* Task validation
* Task sorting
* Linear search
* Binary search
* Algorithm comparison counting
* Project statistics
* Request logging middleware
* CORS support
* AI quick-add task parser
* LocalStorage task caching
* Responsive frontend dashboard

## Technology Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Pydantic
* Uvicorn

### Frontend

* HTML
* CSS
* JavaScript
* Fetch API
* LocalStorage

## Setup

Clone the repository and open a terminal in the project directory.

Create a virtual environment:

```powershell
python -m venv venv
```

Activate the virtual environment on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the dependencies:

```powershell
pip install -r backend\requirements.txt
```

## Run the Backend

Navigate to the backend directory:

```powershell
cd backend
```

Start FastAPI:

```powershell
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

## Run the Frontend

Open the `frontend` directory using VS Code Live Server.

The frontend is configured to communicate with:

```text
http://127.0.0.1:5500
```

## Database

The application uses SQLite.

The database is automatically created when the backend starts.

The main tables are:

* users
* projects
* tasks

## Algorithms

The application implements:

* Insertion sort
* Binary search
* Linear search

Insertion sort is implemented manually without using Python's built-in sorting functions.

Priority values are mapped as:

```text
low = 1
medium = 2
high = 3
```

## Complexity Analysis

### Insertion Sort

Best case:

```text
O(n)
```

Average case:

```text
O(n²)
```

Worst case:

```text
O(n²)
```

### Binary Search

Time complexity:

```text
O(log n)
```

### Linear Search

Time complexity:

```text
O(n)
```

## AI Quick Add

The quick-add feature accepts natural-language task descriptions and deterministically extracts:

* task title
* priority
* due date

Priority keywords include:

* urgent
* ASAP
* whenever
* low priority

Supported date expressions include:

* today
* tomorrow
* next week
* next Monday through Sunday
* Monday through Sunday

## Testing

The following end-to-end operations should be tested:

* Create user
* Create project
* Create task
* Edit task
* Delete task
* Sort tasks
* Search tasks
* Quick-add task
* Verify project statistics
* Verify frontend integration

Algorithm tests can be executed with:

```powershell
python check_algorithms.py
```
