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

const THEME_STORAGE_KEY = 'datamark-theme';
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

const state = {
    token: getSavedToken(),
    user: getSavedUser(),
    projects: [],
    workers: [],
    tasks: []
};

const pageLinks = document.querySelectorAll('[data-page-link]');
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

const elements = {
    mainContent: document.querySelector('#mainContent'),

    themeToggle: document.querySelector('#themeToggle'),
    themeToggleText: document.querySelector('#themeToggleText'),

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

function getSystemTheme() {
    return systemThemeQuery.matches ? 'dark' : 'light';
}

function getSavedTheme() {
    return localStorage.getItem(THEME_STORAGE_KEY);
}

function getCurrentTheme() {
    return getSavedTheme() || getSystemTheme();
}

function updateThemeButton(theme) {
    const isDark = theme === 'dark';

    elements.themeToggle.setAttribute('aria-pressed', String(isDark));
    elements.themeToggle.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
    elements.themeToggleText.textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    updateThemeButton(theme);
}

function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';

    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
}

function getPageNames() {
    return Array.from(pages).map((page) => page.dataset.page);
}

function getInitialPage() {
    const hashPage = window.location.hash.replace('#', '');

    return getPageNames().includes(hashPage) ? hashPage : 'home';
}

function setBusy(isBusy) {
    [
        elements.summaryList,
        elements.dashboardStats,
        elements.projectList,
        elements.workerList,
        elements.taskCard
    ].forEach((element) => {
        element.setAttribute('aria-busy', String(isBusy));
    });
}

function showPage(pageName, shouldFocusMain = true) {
    const nextPage = getPageNames().includes(pageName) ? pageName : 'home';

    pages.forEach((page) => {
        const isCurrentPage = page.dataset.page === nextPage;

        page.classList.toggle('is-active', isCurrentPage);
        page.hidden = !isCurrentPage;
    });

    navigationLinks.forEach((link) => {
        if (link.dataset.pageLink === nextPage) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    if (window.location.hash !== `#${nextPage}`) {
        window.history.replaceState(null, '', `#${nextPage}`);
    }

    window.scrollTo(0, 0);

    if (shouldFocusMain) {
        elements.mainContent.focus({ preventScroll: true });
    }
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
    setBusy(true);

    return loadApiData(state.token)
        .then((data) => {
            state.projects = data.projects;
            state.workers = data.workers;
            state.tasks = data.tasks;

            renderAll();
        })
        .catch(() => showApiError(elements))
        .finally(() => setBusy(false));
}

pageLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        showPage(link.dataset.pageLink);
    });
});

window.addEventListener('hashchange', () => {
    showPage(getInitialPage(), false);
});

systemThemeQuery.addEventListener('change', () => {
    if (!getSavedTheme()) {
        applyTheme(getSystemTheme());
    }
});

elements.themeToggle.addEventListener('click', toggleTheme);

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

applyTheme(getCurrentTheme());
showPage(getInitialPage(), false);
updateAuthView(elements, state);
loadData();