document.addEventListener("DOMContentLoaded", async () => {

    await loadDashboard();

    await loadQuickAddProjects();

    setupQuickAdd();

});

// =========================
// DASHBOARD
// =========================

async function loadDashboard() {
    try {
        const [tasks, projects, statistics] = await Promise.all([
            getTasks(),
            getProjects(),
            getStatistics()
        ]);

        updateStatistics(tasks);
        renderRecentTasks(tasks);
        renderProjects(projects, tasks);

    } catch (error) {
        console.error("Dashboard error:", error);

        showDashboardError(
            "Unable to load dashboard data. Make sure the FastAPI server is running."
        );
    }
}


// =========================
// STATISTICS
// =========================

function updateStatistics(tasks) {

    const total = tasks.length;

    const pending = tasks.filter(
        task => task.status === "pending"
    ).length;

    const inProgress = tasks.filter(
        task =>
            task.status === "in_progress" ||
            task.status === "in-progress" ||
            task.status === "progress"
    ).length;

    const completed = tasks.filter(
        task => task.status === "completed"
    ).length;


    const totalElement = document.getElementById("totalTasks");
    const pendingElement = document.getElementById("pendingTasks");
    const progressElement = document.getElementById("progressTasks");
    const completedElement = document.getElementById("completedTasks");


    if (totalElement) {
        totalElement.textContent = total;
    }

    if (pendingElement) {
        pendingElement.textContent = pending;
    }

    if (progressElement) {
        progressElement.textContent = inProgress;
    }

    if (completedElement) {
        completedElement.textContent = completed;
    }
}


// =========================
// RECENT TASKS
// =========================

function renderRecentTasks(tasks) {

    const container = document.getElementById("recentTasks");

    if (!container) {
        return;
    }

    container.replaceChildren();


    const recentTasks = tasks.slice(-5).reverse();


    if (recentTasks.length === 0) {

        const empty = document.createElement("p");

        empty.textContent = "No tasks available.";

        container.appendChild(empty);

        return;
    }


    recentTasks.forEach(task => {

        const item = document.createElement("div");

        item.className = "task-item";


        const check = document.createElement("div");

        check.className = "task-check";

        check.textContent =
            task.status === "completed" ? "✓" : "○";


        const details = document.createElement("div");

        details.className = "task-details";


        const title = document.createElement("h3");

        title.textContent = task.title;


        const description = document.createElement("p");

        description.textContent =
            task.description || "No description";


        details.appendChild(title);
        details.appendChild(description);


        const priority = document.createElement("span");

        priority.className = `badge ${task.priority || "medium"}`;

        priority.textContent =
            capitalize(task.priority || "medium");


        const status = document.createElement("span");

        status.className = "status";

        status.textContent =
            capitalizeStatus(task.status);


        item.appendChild(check);
        item.appendChild(details);
        item.appendChild(priority);
        item.appendChild(status);


        container.appendChild(item);
    });
}


// =========================
// PROJECTS
// =========================

function renderProjects(projects, tasks) {

    const container = document.getElementById("projectList");

    if (!container) {
        return;
    }

    container.replaceChildren();


    if (projects.length === 0) {

        const empty = document.createElement("p");

        empty.textContent = "No projects available.";

        container.appendChild(empty);

        return;
    }


    projects.slice(0, 5).forEach((project, index) => {

        const item = document.createElement("div");

        item.className = "project-item";


        const color = document.createElement("div");

        color.className = `project-color color-${index % 4}`;


        const info = document.createElement("div");

        info.className = "project-info";


        const name = document.createElement("h3");

        name.textContent = project.name;


        const taskCount = tasks.filter(
            task => Number(task.project_id) === Number(project.id)
        ).length;


        const count = document.createElement("p");

        count.textContent = `${taskCount} task${taskCount !== 1 ? "s" : ""}`;


        info.appendChild(name);
        info.appendChild(count);


        const arrow = document.createElement("span");

        arrow.textContent = "→";


        item.appendChild(color);
        item.appendChild(info);
        item.appendChild(arrow);


        container.appendChild(item);
    });
}

// =========================
// QUICK ADD
// =========================

function setupQuickAdd() {

    const form =
        document.getElementById("quickAddForm");

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const input =
                document.getElementById(
                    "quickAddInput"
                );

            const projectSelect =
                document.getElementById(
                    "quickAddProject"
                );

            const message =
                document.getElementById(
                    "quickAddMessage"
                );


            const description =
                input.value.trim();


            const projectId =
                Number(projectSelect.value);


            // =========================
            // VALIDATION
            // =========================

            if (!description) {

                showMessage(
                    message,
                    "Please enter a task.",
                    "error"
                );

                return;
            }


            if (!projectId) {

                showMessage(
                    message,
                    "Please select a project.",
                    "error"
                );

                return;
            }


            try {

                // =========================
                // CREATE QUICK TASK
                // =========================

                const task =
                    await quickAddTask(
                        description,
                        projectId
                    );


                // Clear input

                input.value = "";


                // Show success

                showMessage(
                    message,
                    `Task #${task.id} created successfully!`,
                    "success"
                );


                // Refresh dashboard

                await loadDashboard();


            } catch (error) {

                console.error(
                    "Quick Add Error:",
                    error
                );


                showMessage(
                    message,
                    error.message,
                    "error"
                );

            }

        }
    );
}

async function loadQuickAddProjects() {

    const quickAddProject =
        document.getElementById(
            "quickAddProject"
        );

    if (!quickAddProject) {
        return;
    }


    try {

        const projects =
            await getProjects();


        quickAddProject.textContent = "";


        if (!projects || projects.length === 0) {

            const option =
                document.createElement("option");

            option.value = "";

            option.textContent =
                "No projects available";

            quickAddProject.appendChild(
                option
            );

            return;
        }


        // Default option

        const defaultOption =
            document.createElement("option");

        defaultOption.value = "";

        defaultOption.textContent =
            "Select a project";

        quickAddProject.appendChild(
            defaultOption
        );


        // Projects

        projects.forEach(project => {

            const option =
                document.createElement("option");

            option.value =
                project.id;

            option.textContent =
                `${project.name} (Project #${project.id})`;

            quickAddProject.appendChild(
                option
            );

        });


    } catch (error) {

        console.error(
            "Project loading error:",
            error
        );


        quickAddProject.textContent = "";


        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "Failed to load projects";

        quickAddProject.appendChild(
            option
        );

    }
}


// =========================
// HELPERS
// =========================

function capitalize(value) {

    if (!value) {
        return "";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
}


function capitalizeStatus(status) {

    if (!status) {
        return "";
    }

    return status
        .replace("_", " ")
        .replace("-", " ")
        .replace(/\b\w/g, char => char.toUpperCase());
}


function showMessage(element, text, type) {

    if (!element) {
        return;
    }

    element.hidden = false;

    element.textContent = text;

    element.className = `message ${type}`;
}


function showDashboardError(message) {

    const content = document.querySelector(".content");

    if (!content) {
        return;
    }

    const error = document.createElement("div");

    error.className = "dashboard-error";

    error.textContent = message;

    content.prepend(error);
}