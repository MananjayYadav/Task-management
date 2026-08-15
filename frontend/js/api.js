const API_BASE_URL = "http://127.0.0.1:8000";

// =========================
// GENERIC API REQUEST
// =========================

async function apiRequest(endpoint, options = {}) {

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );

    let data = null;

    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }

    if (!response.ok) {

        const message =
            data?.detail ||
            data?.message ||
            `Request failed with status ${response.status}`;

        throw new Error(message);
    }

    return data;
}


// =========================
// USERS
// =========================

async function getUsers() {
    return await apiRequest("/users");
}

async function createUser(user) {

    return await apiRequest("/users", {
        method: "POST",
        body: JSON.stringify(user)
    });

}


// =========================
// PROJECTS
// =========================

async function getProjects() {

    return await apiRequest("/projects");

}


async function createProject(project) {

    return await apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify(project)
    });

}


async function updateProject(id, project) {

    return await apiRequest(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(project)
    });

}


async function deleteProject(id) {

    return await apiRequest(`/projects/${id}`, {
        method: "DELETE"
    });

}


// =========================
// TASKS
// =========================

async function getTasks() {

    return await apiRequest("/tasks");

}


async function getTask(taskId) {

    return await apiRequest(`/tasks/${taskId}`);

}


async function createTask(task) {

    return await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify(task)
    });

}


async function updateTask(taskId, task) {

    return await apiRequest(`/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(task)
    });

}


async function deleteTask(taskId) {

    return await apiRequest(`/tasks/${taskId}`, {
        method: "DELETE"
    });

}


// =========================
// SEARCH
// =========================

async function searchTasks(
    title,
    algorithm = "linear"
) {

    return await apiRequest(
        `/tasks/search?title=${encodeURIComponent(title)}&algo=${algorithm}`
    );

}


// =========================
// SORT
// =========================

async function getTasksSortedByPriority() {

    return await apiRequest(
        "/tasks?sort=priority"
    );

}


// =========================
// STATISTICS
// =========================

async function getStatistics() {

    return await apiRequest(
        "/statistics/projects"
    );

}


// =========================
// QUICK ADD
// =========================

async function quickAddTask(
    description,
    projectId
) {

    return await apiRequest(
        "/tasks/quick-add",
        {
            method: "POST",

            body: JSON.stringify({
                description: description,
                project_id: Number(projectId)
            })
        }
    );

}