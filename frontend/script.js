const API_URL = "http://127.0.0.1:8000";

const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const errorMessage = document.getElementById("error-message");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const priorityInput = document.getElementById("priority");
const statusInput = document.getElementById("status");
const dueDateInput = document.getElementById("due_date");

const CACHE_KEY = "task_management_tasks";


// ========================================
// Error handling
// ========================================

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
}


function clearError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
}


// ========================================
// LocalStorage
// ========================================

function saveTasksToCache(tasks) {
    localStorage.setItem(
        CACHE_KEY,
        JSON.stringify(tasks)
    );
}


function loadTasksFromCache() {
    const cachedTasks = localStorage.getItem(CACHE_KEY);

    if (!cachedTasks) {
        return [];
    }

    try {
        return JSON.parse(cachedTasks);
    } catch (error) {
        console.error("Invalid cached tasks:", error);

        localStorage.removeItem(CACHE_KEY);

        return [];
    }
}


// ========================================
// Render tasks
// ========================================

function renderTasks(tasks) {
    taskList.replaceChildren();

    if (!tasks || tasks.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.textContent = "No tasks found.";

        taskList.appendChild(emptyMessage);

        return;
    }


    tasks.forEach(task => {

        const taskCard = document.createElement("div");
        taskCard.className = "task-card";


        // Header

        const header = document.createElement("div");
        header.className = "task-card-header";


        const title = document.createElement("h3");
        title.textContent = task.title;


        const priority = document.createElement("span");
        priority.className = `priority ${task.priority}`;
        priority.textContent = task.priority;


        header.appendChild(title);
        header.appendChild(priority);


        // Description

        const description = document.createElement("p");

        description.textContent =
            task.description || "No description";


        // Metadata

        const meta = document.createElement("div");
        meta.className = "task-meta";


        const status = document.createElement("span");

        status.textContent =
            `Status: ${task.status}`;


        const dueDate = document.createElement("span");

        dueDate.textContent =
            `Due: ${task.due_date || "No due date"}`;


        meta.appendChild(status);
        meta.appendChild(dueDate);


        // Buttons

        const actions = document.createElement("div");
        actions.className = "task-actions";


        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.textContent = "Edit";


        editButton.addEventListener(
            "click",
            () => editTask(task)
        );


        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";


        deleteButton.addEventListener(
            "click",
            () => deleteTask(task.id)
        );


        actions.appendChild(editButton);
        actions.appendChild(deleteButton);


        // Assemble card

        taskCard.appendChild(header);
        taskCard.appendChild(description);
        taskCard.appendChild(meta);
        taskCard.appendChild(actions);


        taskList.appendChild(taskCard);
    });
}


// ========================================
// GET /tasks
// ========================================

async function fetchTasks() {
    clearError();

    try {
        const response = await fetch(
            `${API_URL}/tasks`
        );


        if (!response.ok) {
            throw new Error(
                `Failed to fetch tasks: ${response.status}`
            );
        }


        const tasks = await response.json();


        // Replace cache with live data

        saveTasksToCache(tasks);

        renderTasks(tasks);

    } catch (error) {

        console.error(error);

        showError(
            "Could not load tasks from the server."
        );
    }
}


// ========================================
// POST /tasks
// ========================================

async function addTask(event) {
    event.preventDefault();

    clearError();


    const title = titleInput.value.trim();


    // Validate trimmed title

    if (!title) {
        showError("Task title cannot be empty.");
        titleInput.focus();

        return;
    }


    const taskData = {
        title: title,

        description:
            descriptionInput.value.trim() || null,

        status:
            statusInput.value,

        priority:
            priorityInput.value,

        due_date:
            dueDateInput.value || null,

        project_id: 1
    };


    try {

        const response = await fetch(
            `${API_URL}/tasks`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(taskData)
            }
        );


        if (!response.ok) {

            const errorData = await response.json();

            throw new Error(
                errorData.detail || "Failed to create task."
            );
        }


        // Get created task

        const createdTask = await response.json();


        // Update cache

        const cachedTasks =
            loadTasksFromCache();

        cachedTasks.push(createdTask);

        saveTasksToCache(cachedTasks);


        // Re-render

        renderTasks(cachedTasks);


        // Clear form

        taskForm.reset();

        statusInput.value = "pending";
        priorityInput.value = "medium";


    } catch (error) {

        console.error(error);

        showError(error.message);
    }
}


// ========================================
// PUT /tasks/{id}
// ========================================

async function editTask(task) {

    const newTitle = prompt(
        "Enter new task title:",
        task.title
    );


    if (newTitle === null) {
        return;
    }


    const trimmedTitle = newTitle.trim();


    if (!trimmedTitle) {
        showError("Task title cannot be empty.");

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/tasks/${task.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: trimmedTitle
                })
            }
        );


        if (!response.ok) {

            const errorData =
                await response.json();

            throw new Error(
                errorData.detail ||
                "Failed to update task."
            );
        }


        const updatedTask =
            await response.json();


        // Update cache

        const tasks =
            loadTasksFromCache();


        const index =
            tasks.findIndex(
                item => item.id === task.id
            );


        if (index !== -1) {
            tasks[index] = updatedTask;
        }


        saveTasksToCache(tasks);

        renderTasks(tasks);


    } catch (error) {

        console.error(error);

        showError(error.message);
    }
}


// ========================================
// DELETE /tasks/{id}
// ========================================

async function deleteTask(taskId) {

    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmed) {
        return;
    }


    clearError();


    try {

        const response = await fetch(
            `${API_URL}/tasks/${taskId}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            const errorData =
                await response.json();

            throw new Error(
                errorData.detail ||
                "Failed to delete task."
            );
        }


        // Remove from cache

        let tasks =
            loadTasksFromCache();


        tasks =
            tasks.filter(
                task => task.id !== taskId
            );


        saveTasksToCache(tasks);


        // Re-render

        renderTasks(tasks);


    } catch (error) {

        console.error(error);

        showError(error.message);
    }
}


// ========================================
// Form event
// ========================================

taskForm.addEventListener(
    "submit",
    addTask
);


// ========================================
// Page load
// ========================================

function initializeApp() {

    // Load cached tasks first

    const cachedTasks =
        loadTasksFromCache();


    if (cachedTasks.length > 0) {
        renderTasks(cachedTasks);
    }


    // Then get live backend data

    fetchTasks();
}


initializeApp();