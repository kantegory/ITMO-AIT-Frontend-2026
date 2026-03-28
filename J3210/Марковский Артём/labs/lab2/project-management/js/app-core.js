const storageKeys = {
  auth: "taskhub-auth",
  userId: "taskhub-user-id",
  userName: "taskhub-user-name",
  projects: "taskhub-projects",
};

const initialProjects = [
  {
    id: "nimbus",
    title: "Nimbus CRM",
    description:
      "Черновой проект по обработке входящих заявок. Сейчас доделываем базовые экраны.",
    role: "Участник",
    status: "Активный проект",
    deadline: "27.03.2026",
    members: [
      { name: "Марковский Артём", role: "Участник" },
      { name: "Анна Романова", role: "Администратор" },
      { name: "Илья Воронов", role: "Участник" },
    ],
    actions: [
      {
        type: "tasks",
        title: "Задачи",
        text: "Карточки задач и статусы по ним.",
      },
      {
        type: "discussion",
        title: "Обсуждение",
        text: "Общая лента для быстрых сообщений.",
      },
    ],
    tasks: [
      {
        title: "Доделать страницу входа",
        status: "Завершено",
        priority: "Средний",
        assignee: "Марковский Артём",
        due: "18.03.2026",
      },
      {
        title: "Подправить форму регистрации",
        status: "В работе",
        priority: "Высокий",
        assignee: "Анна Романова",
        due: "21.03.2026",
      },
      {
        title: "Собрать карточку проекта",
        status: "На проверке",
        priority: "Средний",
        assignee: "Илья Воронов",
        due: "22.03.2026",
      },
    ],
    deadlines: [
      {
        stage: "Основные страницы",
        date: "21.03.2026",
        owner: "Марковский Артём",
      },
      {
        stage: "Проверка переходов",
        date: "25.03.2026",
        owner: "Анна Романова",
      },
    ],
    files: [
      {
        name: "nimbus-draft.fig",
        type: "Figma",
        description: "Черновой макет основных экранов.",
      },
    ],
    discussion: [
      {
        author: "Анна Романова",
        time: "Сегодня, 10:15",
        text: "Регистрацию ещё посмотрю вечером, но в целом уже нормально.",
      },
      {
        author: "Марковский Артём",
        time: "Сегодня, 09:20",
        text: "Переходы между страницами поправил, можно снова открыть проект.",
      },
    ],
  },
  {
    id: "atlas",
    title: "Atlas Analytics",
    description:
      "Панель с отчётами для внутренней команды. Пока это скорее черновик структуры.",
    role: "Наблюдатель",
    status: "На согласовании",
    deadline: "29.03.2026",
    members: [
      { name: "Марковский Артём", role: "Наблюдатель" },
      { name: "София Белова", role: "Администратор" },
    ],
    actions: [],
    tasks: [
      {
        title: "Собрать блок с отчётами",
        status: "Новая",
        priority: "Средний",
        assignee: "София Белова",
        due: "23.03.2026",
      },
      {
        title: "Разложить секции по вкладкам",
        status: "В работе",
        priority: "Низкий",
        assignee: "Марковский Артём",
        due: "24.03.2026",
      },
    ],
    deadlines: [
      {
        stage: "Черновая структура",
        date: "23.03.2026",
        owner: "София Белова",
      },
      {
        stage: "Созвон по правкам",
        date: "26.03.2026",
        owner: "Марковский Артём",
      },
    ],
    files: [
      {
        name: "atlas-notes.docx",
        type: "DOCX",
        description: "Набросок по разделам и виджетам.",
      },
      {
        name: "atlas-metrics.xlsx",
        type: "XLSX",
        description: "Таблица с примерами метрик.",
      },
    ],
    discussion: [],
  },
  {
    id: "sprint",
    title: "Sprint Board",
    description:
      "Учебный проект с доской задач. На нём собирал основные сценарии для лабы.",
    role: "Администратор",
    status: "Активный проект",
    deadline: "31.03.2026",
    members: [
      { name: "Марковский Артём", role: "Администратор" },
      { name: "Мария Филатова", role: "Участник" },
      { name: "Егор Смирнов", role: "Участник" },
      { name: "Лиза Котова", role: "Наблюдатель" },
    ],
    actions: [
      {
        type: "team",
        title: "Команда",
        text: "Состав участников и роли.",
      },
      {
        type: "tasks",
        title: "Задачи",
        text: "Создание карточек и изменение статусов.",
      },
      {
        type: "settings",
        title: "Настройки",
        text: "Название, срок и общее описание проекта.",
      },
    ],
    tasks: [
      {
        title: "Доделать поиск по задачам",
        status: "В работе",
        priority: "Высокий",
        assignee: "Марковский Артём",
        due: "20.03.2026",
      },
      {
        title: "Привести в порядок вкладки",
        status: "Новая",
        priority: "Средний",
        assignee: "Мария Филатова",
        due: "22.03.2026",
      },
      {
        title: "Проверить обсуждения в проекте",
        status: "Завершено",
        priority: "Низкий",
        assignee: "Егор Смирнов",
        due: "19.03.2026",
      },
    ],
    deadlines: [
      {
        stage: "Поиск и фильтры",
        date: "20.03.2026",
        owner: "Марковский Артём",
      },
      {
        stage: "Вкладки проекта",
        date: "24.03.2026",
        owner: "Мария Филатова",
      },
      {
        stage: "Финальная проверка",
        date: "31.03.2026",
        owner: "Егор Смирнов",
      },
    ],
    files: [
      {
        name: "sprint-checklist.pdf",
        type: "PDF",
        description: "Короткий список того, что ещё нужно проверить.",
      },
    ],
    discussion: [
      {
        author: "Мария Филатова",
        time: "Сегодня, 12:05",
        text: "Вкладки на месте, но ещё бы чуть подровнять отступы.",
      },
    ],
  },
];

let projects = loadProjects();

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeDateInput(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const parts = [];

  if (digits.slice(0, 2)) parts.push(digits.slice(0, 2));
  if (digits.slice(2, 4)) parts.push(digits.slice(2, 4));
  if (digits.slice(4, 8)) parts.push(digits.slice(4, 8));

  return parts.join(".");
}

function isValidDateString(value) {
  if (!/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/.test(value)) {
    return false;
  }

  const [day, month, year] = value.split(".").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function bindDateMask(field) {
  if (!field) {
    return;
  }

  field.addEventListener("input", (event) => {
    event.currentTarget.value = normalizeDateInput(event.currentTarget.value);
    event.currentTarget.setCustomValidity("");
  });

  field.addEventListener("blur", (event) => {
    const value = event.currentTarget.value.trim();

    if (!value) {
      event.currentTarget.setCustomValidity("");
      return;
    }

    event.currentTarget.setCustomValidity(
      isValidDateString(value) ? "" : "Дата в формате ДД.ММ.ГГГГ",
    );
  });
}

function buildProjectActions(role) {
  if (role === "Администратор") {
    return [
      {
        type: "team",
        title: "Команда",
        text: "Список участников и роли.",
      },
      {
        type: "tasks",
        title: "Задачи",
        text: "Создание карточек и смена статусов.",
      },
      {
        type: "settings",
        title: "Настройки",
        text: "Название проекта, срок и краткое описание.",
      },
      {
        type: "discussion",
        title: "Обсуждение",
        text: "Сообщения внутри проекта.",
      },
    ];
  }

  if (role === "Участник") {
    return [
      {
        type: "tasks",
        title: "Задачи",
        text: "Свои задачи и свободные карточки.",
      },
      {
        type: "discussion",
        title: "Обсуждение",
        text: "Короткие сообщения по проекту.",
      },
    ];
  }

  return [];
}

function applyProjectView(project, userName) {
  if (!project) {
    return null;
  }

  if (typeof decorateProject === "function") {
    return decorateProject(project, userName);
  }

  return cloneData(project);
}

function loadProjects() {
  const raw = sessionStorage.getItem(storageKeys.projects);

  if (!raw) {
    const data = cloneData(initialProjects);
    sessionStorage.setItem(storageKeys.projects, JSON.stringify(data));
    return data;
  }

  try {
    return JSON.parse(raw);
  } catch {
    const data = cloneData(initialProjects);
    sessionStorage.setItem(storageKeys.projects, JSON.stringify(data));
    return data;
  }
}

function saveProjects() {
  sessionStorage.setItem(storageKeys.projects, JSON.stringify(projects));
}

function setProjects(nextProjects) {
  projects = cloneData(nextProjects);
  saveProjects();
  return projects;
}

function syncProjects() {
  projects = loadProjects();
}

function stripProjectUi(project) {
  const nextProject = cloneData(project);
  delete nextProject.actions;
  delete nextProject.role;
  return nextProject;
}

async function refreshProjects(options = { silent: true }) {
  if (typeof loadProjectsFromApi !== "function" || !getUserName()) {
    return projects;
  }

  try {
    const apiProjects = await loadProjectsFromApi(getUserName());
    setProjects(apiProjects);
    return projects;
  } catch (error) {
    console.error(error);

    if (!options.silent) {
      throw error;
    }

    return projects;
  }
}

async function refreshProject(projectId, options = { silent: true }) {
  if (typeof loadProjectFromApi !== "function") {
    return getProject(projectId);
  }

  try {
    const project = await loadProjectFromApi(projectId, getUserName());

    if (!project) {
      return null;
    }

    const nextProjects = projects.filter((item) => item.id !== project.id);
    nextProjects.unshift(project);
    setProjects(nextProjects);

    return project;
  } catch (error) {
    console.error(error);

    if (!options.silent) {
      throw error;
    }

    return getProject(projectId);
  }
}

async function persistProject(projectId) {
  if (typeof saveProjectInApi !== "function") {
    return;
  }

  const project = getProject(projectId);

  if (!project) {
    return;
  }

  try {
    await saveProjectInApi(projectId, stripProjectUi(project));
  } catch (error) {
    console.error(error);
  }
}

function getPageName() {
  return document.body.dataset.page || "";
}

function getProjectIndex(projectId) {
  return projects.findIndex((project) => project.id === projectId);
}

function getProject(projectId) {
  return projects.find((project) => project.id === projectId) || projects[0] || null;
}

function getUserId() {
  return sessionStorage.getItem(storageKeys.userId) || "";
}

function getUserName() {
  return sessionStorage.getItem(storageKeys.userName) || "";
}

function setUserName() {
  const userName = getUserName() || "Пользователь";

  document.querySelectorAll("#headerUserName").forEach((node) => {
    node.textContent = userName;
    node.title = userName;
  });

  document.querySelectorAll("#appUserName").forEach((node) => {
    node.textContent = userName;
    node.title = userName;
  });
}

function saveSessionUser(user) {
  sessionStorage.setItem(storageKeys.auth, "1");
  sessionStorage.setItem(storageKeys.userId, user.id || "");
  sessionStorage.setItem(storageKeys.userName, user.name || "Пользователь");
}

function clearSession() {
  sessionStorage.removeItem(storageKeys.auth);
  sessionStorage.removeItem(storageKeys.userId);
  sessionStorage.removeItem(storageKeys.userName);
  sessionStorage.removeItem(storageKeys.projects);
}

function isAuthorized() {
  return sessionStorage.getItem(storageKeys.auth) === "1" && Boolean(getUserId());
}

function ensureSessionData() {
  if (!sessionStorage.getItem(storageKeys.projects)) {
    saveProjects();
  }
}

function protectPages(pageName) {
  const guestPages = ["index", "register"];
  const privatePages = ["dashboard", "search", "project", "faq"];

  if (privatePages.includes(pageName) && !isAuthorized()) {
    window.location.href = "index.html";
    return false;
  }

  if (guestPages.includes(pageName) && isAuthorized()) {
    window.location.href = "dashboard.html";
    return false;
  }

  ensureSessionData();
  return true;
}

function markNavigation(pageName) {
  document.querySelectorAll(".nav-link[href]").forEach((link) => {
    const href = link.getAttribute("href");
    const fileName = href.split("?")[0].replace(".html", "");

    if (fileName === pageName) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  if (pageName === "project") {
    const projectsLink = document.querySelector('[data-nav-group="projects"]');

    if (projectsLink) {
      projectsLink.classList.add("active");
      projectsLink.setAttribute("aria-current", "page");
    }
  }
}

function getOrCreateFormMessage(form) {
  let message = form.querySelector(".form-message");

  if (!message) {
    message = document.createElement("div");
    message.className = "form-message";
    form.prepend(message);
  }

  return message;
}

function setFormMessage(form, text, type = "danger") {
  const message = getOrCreateFormMessage(form);
  message.className = `form-message alert alert-${type}`;
  message.textContent = text;
}

function clearFormMessage(form) {
  const message = form.querySelector(".form-message");

  if (message) {
    message.remove();
  }
}

function toggleSubmitState(form, disabled) {
  const submitButton = form.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.disabled = disabled;
  }
}

function setupAuthForms() {
  const loginForm = document.getElementById("loginForm");

  if (loginForm && !loginForm.dataset.bound) {
    loginForm.dataset.bound = "1";

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearFormMessage(loginForm);

      if (!loginForm.checkValidity()) {
        loginForm.reportValidity();
        return;
      }

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      toggleSubmitState(loginForm, true);

      try {
        const user = await loginUser(email, password);

        if (!user) {
          setFormMessage(loginForm, "Не удалось войти. Проверь email и пароль.");
          return;
        }

        saveSessionUser(user);
        await refreshProjects();
        window.location.href = "dashboard.html";
      } catch (error) {
        console.error(error);
        setFormMessage(loginForm, "Не получилось подключиться к mock API. Проверь, что json-server запущен.");
      } finally {
        toggleSubmitState(loginForm, false);
      }
    });
  }

  const registerForm = document.getElementById("registerForm");

  if (registerForm && !registerForm.dataset.bound) {
    registerForm.dataset.bound = "1";

    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearFormMessage(registerForm);

      const firstName = document.getElementById("firstName");
      const lastName = document.getElementById("lastName");
      const email = document.getElementById("registerEmail");
      const password = document.getElementById("registerPassword");
      const repeatPassword = document.getElementById("registerPasswordRepeat");

      password.setCustomValidity(
        password.value.length < 6 ? "Минимум 6 символов" : "",
      );
      repeatPassword.setCustomValidity(
        password.value !== repeatPassword.value
          ? "Пароли должны совпадать"
          : "",
      );

      if (!registerForm.checkValidity()) {
        registerForm.reportValidity();
        return;
      }

      toggleSubmitState(registerForm, true);

      try {
        await registerUser({
          firstName: firstName.value.trim().slice(0, 40),
          lastName: lastName.value.trim().slice(0, 40),
          email: email.value.trim(),
          password: password.value,
        });

        window.location.href = "index.html";
      } catch (error) {
        console.error(error);
        setFormMessage(registerForm, error.message || "Не удалось создать аккаунт.");
      } finally {
        toggleSubmitState(registerForm, false);
      }
    });
  }
}

function setupLogout() {
  document.querySelectorAll(".logout-link").forEach((link) => {
    if (link.dataset.bound) {
      return;
    }

    link.dataset.bound = "1";

    link.addEventListener("click", (event) => {
      event.preventDefault();
      clearSession();
      window.location.href = "index.html";
    });
  });
}

function getModalElements() {
  const modalElement = document.getElementById("detailsModal");
  const modalTitle = document.getElementById("detailsModalTitle");
  const modalBody = document.getElementById("detailsModalBody");
  const modalDialog = modalElement
    ? modalElement.querySelector(".modal-dialog")
    : null;

  return { modalElement, modalDialog, modalTitle, modalBody };
}

function openModal(title, body, wide = false) {
  const { modalElement, modalDialog, modalTitle, modalBody } =
    getModalElements();

  if (!modalElement || !modalDialog || !modalTitle || !modalBody) {
    return;
  }

  modalTitle.textContent = title;
  modalBody.innerHTML = body;
  modalDialog.classList.toggle("modal-xl", wide);
  modalDialog.classList.toggle("modal-dialog-scrollable", wide);
  bootstrap.Modal.getOrCreateInstance(modalElement).show();
}

function showDetails(title, body) {
  openModal(title, body, false);
}

function updateProject(projectId, change) {
  const projectIndex = getProjectIndex(projectId);

  if (projectIndex === -1) {
    return;
  }

  change(projects[projectIndex]);
  saveProjects();
  void persistProject(projectId);
}

function deleteProject(projectId) {
  projects = projects.filter((project) => project.id !== projectId);
  saveProjects();
  void deleteProjectInApi(projectId).catch((error) => console.error(error));
}

async function rerenderCurrentPage() {
  const pageName = getPageName();

  if (pageName === "dashboard") {
    if (typeof setupDashboardActions === "function") {
      setupDashboardActions();
    }

    if (typeof renderDashboard === "function") {
      await renderDashboard();
    }
  }

  if (pageName === "search" && typeof renderSearch === "function") {
    await renderSearch();
  }

  if (pageName === "project" && typeof renderProject === "function") {
    await renderProject();
  }
}

function getRoleDescription(role) {
  if (role === "Администратор") {
    return "Можно менять состав команды, задачи и основные параметры проекта.";
  }

  if (role === "Участник") {
    return "Можно работать с задачами и писать в обсуждении проекта.";
  }

  return "Можно смотреть задачи, сроки и файлы, но без редактирования.";
}
