const storageKeys = {
  auth: "taskhub-auth",
  userName: "taskhub-user-name",
  projects: "taskhub-projects",
};

const initialProjects = [
  {
    id: "nimbus",
    title: "Nimbus CRM",
    description: "Черновой проект по обработке входящих заявок.",
    role: "Участник",
    status: "Активный проект",
    deadline: "27.03.2026",
    members: [
      { name: "Марковский Артём", role: "Участник" },
      { name: "Анна Романова", role: "Администратор" },
    ],
    actions: [],
    tasks: [
      { title: "Доделать страницу входа", status: "Завершено", priority: "Средний", assignee: "Марковский Артём", due: "18.03.2026" },
      { title: "Подправить форму регистрации", status: "В работе", priority: "Высокий", assignee: "Анна Романова", due: "21.03.2026" },
    ],
    deadlines: [],
    files: [],
    discussion: [],
  },
  {
    id: "sprint",
    title: "Sprint Board",
    description: "Учебный проект с доской задач.",
    role: "Администратор",
    status: "Активный проект",
    deadline: "31.03.2026",
    members: [
      { name: "Марковский Артём", role: "Администратор" },
      { name: "Мария Филатова", role: "Участник" },
    ],
    actions: [],
    tasks: [
      { title: "Доделать поиск по задачам", status: "В работе", priority: "Высокий", assignee: "Марковский Артём", due: "20.03.2026" },
    ],
    deadlines: [],
    files: [],
    discussion: [],
  },
];

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadProjects() {
  const raw = localStorage.getItem(storageKeys.projects);
  return raw ? JSON.parse(raw) : cloneData(initialProjects);
}

function saveProjects(items) {
  localStorage.setItem(storageKeys.projects, JSON.stringify(items));
}

let projects = loadProjects();

function syncProjects() {
  projects = loadProjects();
}

function getPageName() {
  return document.body?.dataset.page || "index";
}

function getUserName() {
  return localStorage.getItem(storageKeys.userName) || "Марковский Артём";
}

function setUserName() {
  document.querySelectorAll("#headerUserName, #appUserName").forEach((node) => {
    node.textContent = getUserName();
  });
}

function isAuthorized() {
  return localStorage.getItem(storageKeys.auth) === "1";
}

function ensureSessionData() {
  if (!localStorage.getItem(storageKeys.userName)) {
    localStorage.setItem(storageKeys.userName, "Марковский Артём");
  }
  if (!localStorage.getItem(storageKeys.projects)) {
    saveProjects(cloneData(initialProjects));
  }
}

function protectPages(pageName) {
  const publicPages = ["index", "register"];
  if (publicPages.includes(pageName)) {
    return true;
  }
  if (!isAuthorized()) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

function markNavigation(pageName) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (
      (pageName === "index" && href.includes("index.html")) ||
      (pageName === "register" && href.includes("register.html")) ||
      (pageName === "dashboard" && href.includes("dashboard.html")) ||
      (pageName === "search" && href.includes("search.html")) ||
      (pageName === "faq" && href.includes("faq.html"))
    ) {
      link.classList.add("active");
    }
  });
}

function setupAuthForms() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("loginEmail")?.value.trim();
      if (!email) return;
      localStorage.setItem(storageKeys.auth, "1");
      ensureSessionData();
      window.location.href = "dashboard.html";
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const firstName = document.getElementById("firstName")?.value.trim();
      const lastName = document.getElementById("lastName")?.value.trim();
      if (!firstName || !lastName) return;
      localStorage.setItem(storageKeys.auth, "1");
      localStorage.setItem(storageKeys.userName, `${firstName} ${lastName}`);
      ensureSessionData();
      window.location.href = "dashboard.html";
    });
  }
}

function setupLogout() {
  document.querySelectorAll(".logout-link").forEach((link) => {
    link.addEventListener("click", () => {
      localStorage.removeItem(storageKeys.auth);
    });
  });
}
