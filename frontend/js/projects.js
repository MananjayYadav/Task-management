const projectForm = document.getElementById("projectForm");
const projectList = document.getElementById("projectList");
const errorMessage = document.getElementById("errorMessage");
const refreshProjects = document.getElementById("refreshProjects");


// =========================
// ERROR FUNCTIONS
// =========================

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

function hideError() {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
}


// =========================
// LOAD PROJECTS
// =========================

async function loadProjects() {

    hideError();

    projectList.textContent = "Loading projects...";

    try {

        const projects = await apiRequest("/projects");

        renderProjects(projects);

    } catch (error) {

        projectList.textContent = "";

        showError(error.message);

    }
}

/* =========================
   RENDER PROJECTS
========================= */

function renderProjects(projects) {

    projectList.textContent = "";

    if (!projects || projects.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.textContent = "No projects found.";

        projectList.appendChild(emptyMessage);

        return;
    }


    projects.forEach(project => {

        const projectCard = document.createElement("div");

        projectCard.className = "project-card";


        /* PROJECT TITLE */

        const title = document.createElement("h3");

        title.textContent = project.name;


        /* PROJECT ID */

        const projectId = document.createElement("p");

        projectId.textContent =
            `Project ID: ${project.id}`;


        /* OWNER */

        const owner = document.createElement("p");

        owner.textContent =
            `Owner ID: ${project.owner_id}`;


        /* =========================
           BUTTON CONTAINER
        ========================= */

        const actions = document.createElement("div");

        actions.className = "project-actions";


        /* EDIT BUTTON */

        const editButton = document.createElement("button");

        editButton.type = "button";

        editButton.className = "btn primary";

        editButton.textContent = "Edit";


        editButton.onclick = function () {

            openProjectModal(project);

        };


        /* DELETE BUTTON */

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className = "btn delete-btn";

        deleteButton.textContent = "Delete";


        deleteButton.onclick = function () {

            removeProject(project.id);

        };


        /* ADD BUTTONS */

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        /* ADD EVERYTHING */

        projectCard.appendChild(title);

        projectCard.appendChild(projectId);

        projectCard.appendChild(owner);

        projectCard.appendChild(actions);


        projectList.appendChild(projectCard);

    });
}


// =========================
// CREATE PROJECT
// =========================

projectForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        hideError();


        const nameInput =
            document.getElementById("projectName");

        const ownerInput =
            document.getElementById("ownerId");


        const name =
            nameInput.value.trim();

        const ownerId =
            Number(ownerInput.value);


        // Validate name
        if (!name) {

            showError(
                "Project name cannot be empty."
            );

            return;
        }


        // Validate owner
        if (!ownerId || ownerId < 1) {

            showError(
                "Please enter a valid owner ID."
            );

            return;
        }


        try {

            await apiRequest(
                "/projects",
                {
                    method: "POST",

                    body: JSON.stringify({
                        name: name,
                        owner_id: ownerId
                    })
                }
            );


            // Clear form
            projectForm.reset();


            // Reload projects
            await loadProjects();


        } catch (error) {

            showError(error.message);

        }

    }
);


// =========================
// EDIT PROJECT MODAL
// =========================

const editProjectModal =
    document.getElementById(
        "editProjectModal"
    );

const editProjectForm =
    document.getElementById(
        "editProjectForm"
    );


// =========================
// OPEN EDIT MODAL
// =========================

function openProjectModal(project) {

    editProjectModal.classList.remove(
        "hidden"
    );


    // Fill existing values
    document.getElementById(
        "editProjectId"
    ).value = project.id;


    document.getElementById(
        "editProjectName"
    ).value = project.name;


    document.getElementById(
        "editOwnerId"
    ).value = project.owner_id;

}


// =========================
// CLOSE EDIT MODAL
// =========================

function closeProjectModal() {

    editProjectModal.classList.add(
        "hidden"
    );

}


// Close X button
document
    .getElementById("closeProjectModal")
    .addEventListener(
        "click",
        closeProjectModal
    );


// Cancel button
document
    .getElementById("cancelProjectEdit")
    .addEventListener(
        "click",
        closeProjectModal
    );


// =========================
// UPDATE PROJECT
// =========================

editProjectForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const id =
            document.getElementById(
                "editProjectId"
            ).value;


        const name =
            document.getElementById(
                "editProjectName"
            ).value.trim();


        const ownerId =
            Number(
                document.getElementById(
                    "editOwnerId"
                ).value
            );


        // Validation
        if (!name) {

            alert(
                "Project name cannot be empty."
            );

            return;
        }


        if (!ownerId || ownerId < 1) {

            alert(
                "Please enter a valid owner ID."
            );

            return;
        }


        try {

            await updateProject(
                id,
                {
                    name: name,
                    owner_id: ownerId
                }
            );


            // Close modal
            closeProjectModal();


            // Refresh project list
            await loadProjects();


        } catch (error) {

            alert(error.message);

        }

    }
);


// =========================
// DELETE PROJECT
// =========================

async function removeProject(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this project?"
    );


    if (!confirmed) {
        return;
    }


    try {

        await deleteProject(id);


        // Refresh list
        await loadProjects();


    } catch (error) {

        showError(error.message);

    }
}


// =========================
// REFRESH
// =========================

refreshProjects.addEventListener(
    "click",
    loadProjects
);


// =========================
// INITIAL LOAD
// =========================

loadProjects();