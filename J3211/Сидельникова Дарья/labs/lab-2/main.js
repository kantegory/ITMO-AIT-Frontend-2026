import { initRegisterPage, initLoginPage } from "./exit.js";
import {
    initDashboardPage,
    initProjectPage,
    initCreateProjectPage,
    initAddTaskPage
} from "./dashboard.js";

document.addEventListener("DOMContentLoaded", async () => {
    if (document.getElementById("registerForm")) {
        initRegisterPage();
    }

    if (document.getElementById("loginForm")) {
        initLoginPage();
    }

    if (document.getElementById("userProjects") || document.getElementById("todoTasks")) {
        await initDashboardPage();
    }

    if (document.getElementById("projectTitle")) {
        await initProjectPage();
    }

    if (document.getElementById("createProjectBtn")) {
        await initCreateProjectPage();
    }

    if (document.getElementById("createTaskBtn")) {
        await initAddTaskPage();
    }
});