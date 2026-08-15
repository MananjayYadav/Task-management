const taskForm = document.getElementById("taskForm");

const taskList = document.getElementById("taskList");

const errorMessage = document.getElementById("errorMessage");

const refreshTasks = document.getElementById("refreshTasks");


function showError(message) {

    errorMessage.textContent = message;

    errorMessage.classList.remove("hidden");

}


function hideError() {

    errorMessage.textContent = "";

    errorMessage.classList.add("hidden");

}


/* =========================
   LOAD TASKS
========================= */

async function loadTasks() {

    hideError();

    taskList.textContent = "Loading tasks...";


    try {

        const tasks = await apiRequest("/tasks");

        renderTasks(tasks);

    } catch (error) {

        taskList.textContent = "";

        showError(error.message);

    }

}


/* =========================
   RENDER TASKS
========================= */
function renderTasks(tasks) {

    taskList.textContent = "";

    if (!tasks || tasks.length === 0) {

        const empty = document.createElement("p");

        empty.textContent = "No tasks found.";

        taskList.appendChild(empty);

        return;
    }

    tasks.forEach(task => {

        const card = document.createElement("div");

        card.className = "task-card";


        // =========================
        // TITLE
        // =========================

        const title = document.createElement("h3");

        title.textContent = task.title;


        // =========================
        // DESCRIPTION
        // =========================

        const description = document.createElement("p");

        description.textContent =
            task.description || "No description";


        // =========================
        // STATUS
        // =========================

        const status = document.createElement("span");

        status.className =
            `badge status-${task.status}`;

        status.textContent =
            task.status;


        // =========================
        // PRIORITY
        // =========================

        const priority = document.createElement("span");

        priority.className =
            `badge priority-${task.priority}`;

        priority.textContent =
            `Priority: ${task.priority}`;


        // =========================
        // PROJECT
        // =========================

        const project = document.createElement("p");

        project.textContent =
            `Project ID: ${task.project_id}`;


        // =========================
        // DUE DATE
        // =========================

        const dueDate = document.createElement("p");

        dueDate.textContent =
            task.due_date
                ? `Due: ${task.due_date}`
                : "No due date";


        // =========================
        // BUTTON CONTAINER
        // =========================

        const actions = document.createElement("div");

        actions.className = "task-actions";


        // =========================
        // EDIT BUTTON
        // =========================

        const editButton =
            document.createElement("button");

        editButton.type = "button";

        editButton.className =
            "btn secondary";

        editButton.textContent =
            "Edit";


        // IMPORTANT
        // This opens your edit modal
        editButton.onclick = function () {

            openTaskModal(task);

        };


        // =========================
        // DELETE BUTTON
        // =========================

        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className =
            "btn danger";

        deleteButton.textContent =
            "Delete";


        deleteButton.onclick = function () {

            removeTask(task.id);

        };


        // Add buttons to actions

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        // =========================
        // ADD EVERYTHING TO CARD
        // =========================

        card.appendChild(title);

        card.appendChild(description);

        card.appendChild(status);

        card.appendChild(priority);

        card.appendChild(project);

        card.appendChild(dueDate);

        card.appendChild(actions);


        // Add card to list

        taskList.appendChild(card);

    });
}


/* =========================
   CREATE TASK
========================= */

taskForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    hideError();


    const title =
        document.getElementById("title")
            .value
            .trim();


    const description =
        document.getElementById("description")
            .value
            .trim();


    const status =
        document.getElementById("status").value;


    const priority =
        document.getElementById("priority").value;


    const dueDate =
        document.getElementById("dueDate").value;


    const projectId =
        Number(document.getElementById("projectId").value);


    /* VALIDATION */

    if (!title) {

        showError("Task title cannot be empty.");

        return;

    }


    if (!projectId || projectId < 1) {

        showError("Please enter a valid project ID.");

        return;

    }


    const taskData = {

        title: title,

        description: description || null,

        status: status,

        priority: priority,

        due_date: dueDate || null,

        project_id: projectId

    };


    try {

        await apiRequest("/tasks", {

            method: "POST",

            body: JSON.stringify(taskData)

        });


        taskForm.reset();


        // Restore default priority

        document.getElementById(
            "priority"
        ).value = "medium";


        await loadTasks();


    } catch (error) {

        showError(error.message);

    }

});


/* =========================
   EDIT TASK
========================= */

async function editTask(task) {

    const title =
        prompt(
            "Task title:",
            task.title
        );


    if (title === null) {
        return;
    }


    const trimmedTitle =
        title.trim();


    if (!trimmedTitle) {

        showTaskError(
            "Task title cannot be empty."
        );

        return;
    }


    const description =
        prompt(
            "Description:",
            task.description || ""
        );


    if (description === null) {
        return;
    }


    const priority =
        prompt(
            "Priority (low, medium, high):",
            task.priority
        );


    if (priority === null) {
        return;
    }


    if (
        !["low", "medium", "high"]
            .includes(priority.toLowerCase())
    ) {

        showTaskError(
            "Priority must be low, medium or high."
        );

        return;
    }


    const status =
        prompt(
            "Status (pending, in_progress, completed):",
            task.status
        );


    if (status === null) {
        return;
    }


    if (
        ![
            "pending",
            "in_progress",
            "completed"
        ].includes(status.toLowerCase())
    ) {

        showTaskError(
            "Invalid status."
        );

        return;
    }


    const dueDate =
        prompt(
            "Due date (YYYY-MM-DD):",
            task.due_date || ""
        );


    if (dueDate === null) {
        return;
    }


    try {

        await updateTask(
            task.id,
            {

                title: trimmedTitle,

                description:
                    description.trim() || null,

                status:
                    status.toLowerCase(),

                priority:
                    priority.toLowerCase(),

                due_date:
                    dueDate.trim() || null,

                project_id:
                    task.project_id

            }
        );


        await loadTasks();


    } catch (error) {

        showTaskError(error.message);

    }

}


/* =========================
   DELETE TASK
========================= */

async function removeTask(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteTask(id);

        await loadTasks();

    } catch (error) {

        showTaskError(error.message);

    }

}

/* =========================
   EDIT TASK
========================= */

const editTaskModal = document.getElementById("editTaskModal");
const editTaskForm = document.getElementById("editTaskForm");

const closeTaskModal = document.getElementById("closeTaskModal");
const cancelTaskEdit = document.getElementById("cancelTaskEdit");

function openTaskModal(task){

    editTaskModal.classList.remove("hidden");

    document.getElementById("editTaskId").value = task.id;
    document.getElementById("editTitle").value = task.title;
    document.getElementById("editDescription").value = task.description || "";
    document.getElementById("editStatus").value = task.status;
    document.getElementById("editPriority").value = task.priority;
    document.getElementById("editDueDate").value = task.due_date || "";
    document.getElementById("editProjectId").value = task.project_id;
}

function closeTaskEditModal(){

    editTaskModal.classList.add("hidden");
}

closeTaskModal.onclick = closeTaskEditModal;
cancelTaskEdit.onclick = closeTaskEditModal;

editTaskForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const id = document.getElementById("editTaskId").value;

    try{

        await updateTask(id,{
            title:document.getElementById("editTitle").value.trim(),
            description:document.getElementById("editDescription").value.trim() || null,
            status:document.getElementById("editStatus").value,
            priority:document.getElementById("editPriority").value,
            due_date:document.getElementById("editDueDate").value || null,
            project_id:Number(document.getElementById("editProjectId").value)
        });

        closeTaskEditModal();
        loadTasks();

    }catch(error){

        alert(error.message);

    }

});



/* =========================
   REFRESH
========================= */

refreshTasks.addEventListener(
    "click",
    loadTasks
);


/* =========================
   INITIAL LOAD
========================= */

loadTasks();