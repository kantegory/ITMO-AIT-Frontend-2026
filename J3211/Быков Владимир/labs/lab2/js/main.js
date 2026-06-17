import { loadApiData } from './api.js';
import { clearAuth, getSavedToken, getSavedUser, login, register, saveAuth } from './auth.js';
import {
    getFilteredProjects,
    renderDashboard,
    renderProjects,
    renderSummary,
    renderTask,
    renderWorkers,
    setMessage,
    showApiError,
    updateAuthView
} from './render.js';

const state = {
    token: getSavedToken(),
    user: getSavedUser(),
    projects: [],
    workers: [],
    tasks: []
};

const pageLinks = document.querySelectorAll('[data-page-link]');
const pages = document.querySelectorAll('[data-page]');

const elements = {
    loginLink: document.querySelector('#loginLink'),
    registerLink: document.querySelector('#registerLink'),
    logoutButton: document.querySelector('#logoutButton'),
    reloadButton: document.querySelector('#reloadButton'),

    loginForm: document.querySelector('#loginForm'),
    registerForm: document.querySelector('#registerForm'),
    loginMessage: document.querySelector('#loginMessage'),
    registerMessage: document.querySelector('#registerMessage'),

    summaryList: document.querySelector('#summaryList'),
    dashboardStats: document.querySelector('#dashboardStats'),
    userInfo: document.querySelector('#userInfo'),
    projectList: document.querySelector('#projectList'),
    workerList: document.querySelector('#workerList'),
    taskCard: document.querySelector('#taskCard'),
    instructionText: document.querySelector('#instructionText'),

    statusFilter: document.querySelector('#statusFilter'),
    typeFilter: document.querySelector('#typeFilter'),
    workerFilter: document.querySelector('#workerFilter'),
    resetFilters: document.querySelector('#resetFilters')
};

function showPage(pageName) {
    pages.forEach((page) => {
        page.classList.toggle('is-active', page.dataset.page === pageName);
    });

    window.scrollTo(0, 0);
}

function getFilters() {
    return {
        status: elements.statusFilter.value,
        type: elements.typeFilter.value,
        worker: elements.workerFilter.value
    };
}

function updateProjectList() {
    const filteredProjects = getFilteredProjects(state.projects, getFilters());

    renderProjects(elements.projectList, filteredProjects, showPage);
}

function renderAll() {
    renderSummary(elements.summaryList, state.projects);
    renderDashboard(elements.dashboardStats, state.projects);
    updateProjectList();
    renderWorkers(elements.workerList, state.workers);
    renderTask(elements.taskCard, elements.instructionText, state.tasks);
    updateAuthView(elements, state);
}

function loadData() {
    return loadApiData(state.token)
        .then((data) => {
            state.projects = data.projects;
            state.workers = data.workers;
            state.tasks = data.tasks;

            renderAll();
        })
        .catch(() => showApiError(elements));
}

pageLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        showPage(link.dataset.pageLink);
    });
});

elements.loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    login(elements.loginForm.loginEmail.value, elements.loginForm.loginPassword.value)
        .then((data) => {
            const authData = saveAuth(data);

            state.token = authData.token;
            state.user = authData.user;

            setMessage(elements.loginMessage, 'Вход выполнен. Данные загружены из API.', 'is-success');

            return loadData();
        })
        .then(() => showPage('dashboard'))
        .catch(() => setMessage(elements.loginMessage, 'Не удалось войти. Проверьте почту и пароль.', 'is-error'));
});

elements.registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    register({
        email: elements.registerForm.email.value,
        password: elements.registerForm.password.value,
        name: elements.registerForm.name.value,
        role: elements.registerForm.role.value
    })
        .then((data) => {
            const authData = saveAuth(data);

            state.token = authData.token;
            state.user = authData.user;

            setMessage(elements.registerMessage, 'Аккаунт создан. Вы вошли в систему.', 'is-success');

            return loadData();
        })
        .then(() => showPage('dashboard'))
        .catch(() => setMessage(elements.registerMessage, 'Регистрация не выполнена. Возможно, почта уже занята.', 'is-error'));
});

elements.logoutButton.addEventListener('click', () => {
    state.token = null;
    state.user = null;

    clearAuth();
    updateAuthView(elements, state);
    showPage('home');
});

elements.reloadButton.addEventListener('click', loadData);

elements.statusFilter.addEventListener('change', updateProjectList);
elements.typeFilter.addEventListener('change', updateProjectList);
elements.workerFilter.addEventListener('change', updateProjectList);

elements.resetFilters.addEventListener('click', () => {
    elements.statusFilter.value = 'all';
    elements.typeFilter.value = 'all';
    elements.workerFilter.value = 'all';

    updateProjectList();
});

updateAuthView(elements, state);
loadData();
