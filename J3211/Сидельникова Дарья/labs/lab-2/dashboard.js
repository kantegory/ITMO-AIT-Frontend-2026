import {
    getProjects,
    getUserTasks,
    getProjectById,
    getProjectTasks,
    createProject,
    createTask
} from "./api.js";

export function getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

export function checkAuth() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "../exit/login.html";
    }
}

export function loadUser() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userAvatar = document.getElementById("userAvatar");

    if (userName) {
        userName.textContent = currentUser.name;
    }

    if (userEmail) {
        userEmail.textContent = currentUser.email;
    }

    if (userAvatar) {
        userAvatar.src = currentUser.avatar;
    }
}

export async function getAccessibleProjectsForUser(userId) {
    const projects = await getProjects();

    return projects.filter(project => {
        const isOwner = String(project.ownerId) === String(userId);

        const isTeamMember =
            Array.isArray(project.team) &&
            project.team.some(member => String(member.id) === String(userId));

        return isOwner || isTeamMember;
    });
}

export async function renderDefaultProjectCard() {
    const currentUser = getCurrentUser();
    const userProjects = document.getElementById("userProjects");

    if (!currentUser || !userProjects) return;

    const projects = await getAccessibleProjectsForUser(currentUser.id);

    userProjects.innerHTML = "";

    if (!projects.length) {
        userProjects.innerHTML = `<p class="text-muted">No projects yet.</p>`;
        return;
    }

    projects.forEach(project => {
        userProjects.innerHTML += `
            <div class="col-md-4">
                <a href="project.html?id=${project.id}" class="text-decoration-none text-dark">
                    <div class="card project-card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${project.name}</h5>
                            <p class="card-text text-muted mb-1">Owner: ${project.ownerName || "-"}</p>
                            <p class="card-text text-muted">${project.description || ""}</p>
                        </div>
                    </div>
                </a>
            </div>
        `;
    });
}

export async function renderDashboardTasks() {
    const currentUser = getCurrentUser();
    const todoTasks = document.getElementById("todoTasks");
    const progressTasks = document.getElementById("progressTasks");
    const doneTasks = document.getElementById("doneTasks");

    if (!currentUser || !todoTasks || !progressTasks || !doneTasks) return;

    try {
        const tasks = await getUserTasks(currentUser.id);

        todoTasks.innerHTML = "";
        progressTasks.innerHTML = "";
        doneTasks.innerHTML = "";

        if (!tasks.length) {
            todoTasks.innerHTML = `<p class="text-muted">No tasks yet.</p>`;
            return;
        }

        tasks.forEach(task => {
            const taskCard = `
                <div class="task-card">
                    <strong>${task.title}</strong>
                    <div class="task-project">${task.project || "-"}</div>
                    <div class="task-project">Assignee: ${task.assigneeName || "-"}</div>
                    <div class="task-project">Creator: ${task.creatorName || "-"}</div>
                    <div class="task-due">Due: ${task.due || "-"}</div>
                </div>
            `;

            if (task.status === "To Do") {
                todoTasks.innerHTML += taskCard;
            } else if (task.status === "In Progress") {
                progressTasks.innerHTML += taskCard;
            } else if (task.status === "Done") {
                doneTasks.innerHTML += taskCard;
            } else {
                todoTasks.innerHTML += taskCard;
            }
        });
    } catch (error) {
        console.error("Ошибка загрузки задач:", error);
        todoTasks.innerHTML = `<p class="text-danger">Failed to load tasks</p>`;
    }
}

export async function renderProjectPage() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id");

    const projectTitle = document.getElementById("projectTitle");
    const projectDescription = document.getElementById("projectDescription");
    const projectTeam = document.getElementById("projectTeam");
    const userTasks = document.getElementById("userTasks");

    if (!projectId || !projectTitle || !projectDescription || !projectTeam || !userTasks) return;

    const project = await getProjectById(projectId);
    const tasks = await getProjectTasks(projectId);

    projectTitle.textContent = project.name;
    projectDescription.textContent = project.description || "";

    projectTeam.innerHTML = "";

    const teamMembers = Array.isArray(project.team) ? [...project.team] : [];

    const ownerAlreadyInTeam = teamMembers.some(
        member => String(member.id) === String(project.ownerId)
    );

    if (!ownerAlreadyInTeam && project.ownerId) {
        teamMembers.unshift({
            id: project.ownerId,
            name: project.ownerName || "Project owner"
        });
    }

    if (teamMembers.length) {
        teamMembers.forEach(member => {
            projectTeam.innerHTML += `
                <li class="list-group-item">
                    ${member.name}
                    ${String(member.id) === String(project.ownerId) ? " (Owner)" : ""}
                </li>
            `;
        });
    } else {
        projectTeam.innerHTML = `<li class="list-group-item text-muted">No team members</li>`;
    }

    userTasks.innerHTML = "";
    tasks.forEach(task => {
        userTasks.innerHTML += `
            <tr>
                <td>${task.title}</td>
                <td>${task.project}</td>
                <td>${task.assigneeName || "-"}</td>
                <td>${task.creatorName || "-"}</td>
                <td>${task.status}</td>
                <td>${task.due || "-"}</td>
            </tr>
        `;
    });
}

export async function initCreateProjectPage() {
    checkAuth();

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const createProjectBtn = document.getElementById("createProjectBtn");
    const copyInviteBtn = document.getElementById("copyInviteBtn");
    const projectNameInput = document.getElementById("projectName");
    const projectDescriptionInput = document.getElementById("projectDescription");
    const inviteLinkInput = document.getElementById("inviteLink");

    if (!createProjectBtn || !copyInviteBtn || !projectNameInput || !projectDescriptionInput || !inviteLinkInput) {
        return;
    }

    createProjectBtn.addEventListener("click", async () => {
        const name = projectNameInput.value.trim();
        const description = projectDescriptionInput.value.trim();

        if (!name) {
            alert("Введите название проекта");
            return;
        }

        try {
            const newProject = await createProject({
                name,
                description,
                role: "Administrator",
                ownerId: currentUser.id,
                ownerName: currentUser.name,
                team: [
                    {
                        id: currentUser.id,
                        name: currentUser.name
                    }
                ]
            });

            inviteLinkInput.value = `project.html?id=${newProject.id}`;
            alert("Проект успешно создан");
        } catch (error) {
            console.error(error);
            alert(error.message || "Ошибка при создании проекта");
        }
    });

    copyInviteBtn.addEventListener("click", async () => {
        if (!inviteLinkInput.value) {
            alert("Сначала создайте проект");
            return;
        }

        try {
            await navigator.clipboard.writeText(inviteLinkInput.value);
            alert("Ссылка скопирована");
        } catch (error) {
            console.error(error);
            alert("Не удалось скопировать ссылку");
        }
    });
}

export async function initAddTaskPage() {
    checkAuth();

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const taskTitleInput = document.getElementById("taskTitle");
    const taskDescriptionInput = document.getElementById("taskDescription");
    const taskProjectSelect = document.getElementById("taskProject");
    const taskAssigneeSelect = document.getElementById("taskAssignee");
    const taskStatusSelect = document.getElementById("taskStatus");
    const taskDueInput = document.getElementById("taskDue");
    const createTaskBtn = document.getElementById("createTaskBtn");

    if (
        !taskTitleInput ||
        !taskDescriptionInput ||
        !taskProjectSelect ||
        !taskAssigneeSelect ||
        !taskStatusSelect ||
        !taskDueInput ||
        !createTaskBtn
    ) {
        return;
    }

    let availableProjects = [];

    try {
        availableProjects = await getAccessibleProjectsForUser(currentUser.id);

        taskProjectSelect.innerHTML = `<option value="">Select project</option>`;
        taskAssigneeSelect.innerHTML = `<option value="">Select participant</option>`;

        if (!availableProjects.length) {
            taskProjectSelect.innerHTML = `<option value="">No available projects</option>`;
            return;
        }

        availableProjects.forEach(project => {
            taskProjectSelect.innerHTML += `
                <option value="${project.id}">
                    ${project.name}
                </option>
            `;
        });

        taskProjectSelect.addEventListener("change", () => {
            taskAssigneeSelect.innerHTML = `<option value="">Select participant</option>`;

            const selectedProject = availableProjects.find(
                project => String(project.id) === String(taskProjectSelect.value)
            );

            if (!selectedProject || !Array.isArray(selectedProject.team)) return;

            const teamMembers = [...selectedProject.team];
            const ownerAlreadyInTeam = teamMembers.some(
                member => String(member.id) === String(selectedProject.ownerId)
            );

            if (!ownerAlreadyInTeam && selectedProject.ownerId) {
                teamMembers.unshift({
                    id: selectedProject.ownerId,
                    name: selectedProject.ownerName || "Project owner"
                });
            }

            teamMembers.forEach(member => {
                taskAssigneeSelect.innerHTML += `
                    <option value="${member.id}" data-user-name="${member.name}">
                        ${member.name}
                    </option>
                `;
            });
        });
    } catch (error) {
        console.error(error);
        alert("Не удалось загрузить данные для создания задачи");
    }

    createTaskBtn.addEventListener("click", async () => {
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const projectId = taskProjectSelect.value;
        const assigneeId = taskAssigneeSelect.value;
        const status = taskStatusSelect.value;
        const due = taskDueInput.value;

        if (!title) {
            alert("Введите название задачи");
            return;
        }

        if (!projectId) {
            alert("Выберите проект");
            return;
        }

        if (!assigneeId) {
            alert("Выберите участника");
            return;
        }

        if (!due) {
            alert("Выберите дедлайн");
            return;
        }

        const selectedProject = availableProjects.find(
            project => String(project.id) === String(projectId)
        );

        const selectedAssigneeOption = taskAssigneeSelect.options[taskAssigneeSelect.selectedIndex];
        const assigneeName = selectedAssigneeOption?.dataset?.userName || "";

        try {
            await createTask({
                title,
                description,
                project: selectedProject ? selectedProject.name : "",
                projectId,
                assigneeId,
                assigneeName,
                creatorId: currentUser.id,
                creatorName: currentUser.name,
                status,
                due
            });

            alert("Задача успешно создана");
            window.location.href = "dashboard.html";
        } catch (error) {
            console.error(error);
            alert(error.message || "Ошибка при создании задачи");
        }
    });
}

export async function initDashboardPage() {
    checkAuth();
    loadUser();
    await renderDefaultProjectCard();
    await renderDashboardTasks();
}

export async function initProjectPage() {
    checkAuth();
    await renderProjectPage();
}