const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const strengthBar = document.getElementById("strengthBar");

const defaultUser = {
    id: 1,
    name: "Default user",
    email: "email@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=12"
};

const defaultProject = {
    id: 1,
    name: "Project 1",
    description: "This is the default project for demonstration.",
    role: "Administrator",
    team: [
        "Daria Side",
        "Man 1",
        "Woman 1"
    ],
    tasks: [
        {
            title: "Task 1",
            project: "Project 1",
            status: "To Do",
            due: "2026-03-20"
        },
        {
            title: "Task 2",
            project: "Project 1",
            status: "In Progress",
            due: "2026-03-22"
        },
        {
            title: "Task 3",
            project: "Project 1",
            status: "Done",
            due: "2026-03-18"
        }
    ]
};

password?.addEventListener("input", function () {
    const value = password.value;
    let strength = 0;

    const ruleLength = document.getElementById("ruleLength");
    const ruleNumber = document.getElementById("ruleNumber");

    if (value.length >= 8) {
        ruleLength?.classList.add("rule-valid");
        strength++;
    } else {
        ruleLength?.classList.remove("rule-valid");
    }

    if (/\d/.test(value)) {
        ruleNumber?.classList.add("rule-valid");
        strength++;
    } else {
        ruleNumber?.classList.remove("rule-valid");
    }

    if (!strengthBar) return;

    if (strength === 0) {
        strengthBar.style.width = "0%";
        strengthBar.style.background = "transparent";
    } else if (strength === 1) {
        strengthBar.style.width = "50%";
        strengthBar.style.background = "orange";
    } else {
        strengthBar.style.width = "100%";
        strengthBar.style.background = "green";
    }
});

function togglePassword(id) {
    const input = document.getElementById(id);
    if (!input) return;

    input.type = input.type === "password" ? "text" : "password";
}

confirmPassword?.addEventListener("input", function () {
    const passwordValue = password?.value || "";
    const confirmValue = confirmPassword.value;
    const confirmError = document.getElementById("confirmError");

    if (!confirmError) return;

    if (confirmValue !== passwordValue) {
        confirmError.textContent = "Пароли не совпадают";
    } else {
        confirmError.textContent = "";
    }
});

function loginUser() {
    window.location.href = "../base/dashboard.html";
}

function loadUser() {
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userAvatar = document.getElementById("userAvatar");

    if (userName) {
        userName.textContent = defaultUser.name;
    }

    if (userEmail) {
        userEmail.textContent = defaultUser.email;
    }

    if (userAvatar) {
        userAvatar.src = defaultUser.avatar;
    }
}

function renderDefaultProjectCard() {
    const userProjects = document.getElementById("userProjects");
    if (!userProjects) return;

    userProjects.innerHTML = `
        <div class="col-md-4">
            <a href="project.html?id=1" class="text-decoration-none text-dark">
                <div class="card project-card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${defaultProject.name}</h5>
                        <p class="card-text text-muted mb-1">Role: ${defaultProject.role}</p>
                        <p class="card-text text-muted">${defaultProject.description}</p>
                    </div>
                </div>
            </a>
        </div>
    `;
}

function renderDashboardTasks() {
    const todoTasks = document.getElementById("todoTasks");
    const progressTasks = document.getElementById("progressTasks");
    const doneTasks = document.getElementById("doneTasks");

    if (!todoTasks || !progressTasks || !doneTasks) return;

    todoTasks.innerHTML = "";
    progressTasks.innerHTML = "";
    doneTasks.innerHTML = "";

    defaultProject.tasks.forEach(task => {
        const taskCard = `
            <div class="task-card">
                <strong>${task.title}</strong>
                <div class="task-project">${task.project}</div>
                <div class="task-due">Due: ${task.due}</div>
            </div>
        `;

        if (task.status === "To Do") {
            todoTasks.innerHTML += taskCard;
        } else if (task.status === "In Progress") {
            progressTasks.innerHTML += taskCard;
        } else if (task.status === "Done") {
            doneTasks.innerHTML += taskCard;
        }
    });
}

function renderProjectPage() {
    const projectTitle = document.getElementById("projectTitle");
    const projectDescription = document.getElementById("projectDescription");
    const projectTeam = document.getElementById("projectTeam");
    const userTasks = document.getElementById("userTasks");

    if (!projectTitle || !projectDescription || !projectTeam || !userTasks) return;

    projectTitle.textContent = defaultProject.name;
    projectDescription.textContent = defaultProject.description;

    projectTeam.innerHTML = "";
    defaultProject.team.forEach(member => {
        projectTeam.innerHTML += `
            <li class="list-group-item">${member}</li>
        `;
    });

    userTasks.innerHTML = "";
    defaultProject.tasks.forEach(task => {
        userTasks.innerHTML += `
            <tr>
                <td>${task.title}</td>
                <td>${task.project}</td>
                <td>${task.status}</td>
                <td>${task.due}</td>
            </tr>
        `;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadUser();
    renderDefaultProjectCard();
    renderDashboardTasks();
    renderProjectPage();
});