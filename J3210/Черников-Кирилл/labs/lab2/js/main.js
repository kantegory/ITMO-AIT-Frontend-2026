const API_BASE_URL = "http://localhost:3000";
const SESSION_KEY = "dataforge_session";
const THEME_KEY = "dataforge_theme";
const PROTECTED_PAGES = new Set(["dashboard.html", "search.html", "task.html", "workers.html"]);

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initThemeToggle();
  initApp().catch((error) => {
    console.error("Application bootstrap failed:", error);
    renderBootstrapError(error);
  });
});

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(saved || preferred);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-bs-theme", theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀ Светлая" : "☾ Тёмная";
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", toggleTheme);
  }
}

async function initApp() {
  const currentPage = getCurrentPage();
  const session = getSession();

  if (PROTECTED_PAGES.has(currentPage) && !session) {
    redirectTo("login.html");
    return;
  }

  if ((currentPage === "login.html" || currentPage === "register.html") && session) {
    redirectTo("dashboard.html");
    return;
  }

  if (session) {
    try {
      const user = await apiFetch(`/users/${session.userId}`);
      updateNavbar(user);
    } catch (error) {
      clearSession();
      if (PROTECTED_PAGES.has(currentPage)) {
        redirectTo("login.html");
        return;
      }
    }
  }

  switch (currentPage) {
    case "login.html":
      initLoginPage();
      break;
    case "register.html":
      initRegisterPage();
      break;
    case "dashboard.html":
      await initDashboardPage();
      break;
    case "search.html":
      await initSearchPage();
      break;
    case "task.html":
      await initTaskPage();
      break;
    case "workers.html":
      await initWorkersPage();
      break;
    default:
      break;
  }
}

function initLoginPage() {
  const form = document.getElementById("login-form");
  const alertContainer = document.getElementById("login-alert");
  const submitButton = document.getElementById("login-submit");
  const successText = document.getElementById("auth-success-text");

  if (!form || !alertContainer || !submitButton || !successText) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    clearAlerts(alertContainer);

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    setButtonLoading(submitButton, true, "Проверяем...");

    try {
      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value;
      const users = await apiFetch(`/users?email=${encodeURIComponent(email)}`);
      const user = users.find((item) => item.password === password);

      if (!user) {
        throw new Error("Пользователь не найден. Проверьте email и пароль.");
      }

      setSession(user);
      successText.textContent = `Добро пожаловать, ${user.firstName} ${user.lastName}. Сессия создана, можно переходить в кабинет.`;
      showModal("authSuccessModal");
      window.setTimeout(() => redirectTo("dashboard.html"), 900);
    } catch (error) {
      renderAlert(alertContainer, "danger", error.message || "Не удалось выполнить вход.");
    } finally {
      form.classList.add("was-validated");
      setButtonLoading(submitButton, false, "Войти");
    }
  });
}

function initRegisterPage() {
  const form = document.getElementById("register-form");
  const alertContainer = document.getElementById("register-alert");
  const submitButton = document.getElementById("register-submit");
  const passwordInput = document.getElementById("regPassword");
  const repeatPasswordInput = document.getElementById("regPassword2");
  const successText = document.getElementById("register-success-text");

  if (!form || !alertContainer || !submitButton || !passwordInput || !repeatPasswordInput || !successText) {
    return;
  }

  const syncPasswords = () => {
    repeatPasswordInput.setCustomValidity(
      repeatPasswordInput.value && passwordInput.value !== repeatPasswordInput.value ? "Пароли не совпадают." : ""
    );
  };

  passwordInput.addEventListener("input", syncPasswords);
  repeatPasswordInput.addEventListener("input", syncPasswords);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    clearAlerts(alertContainer);
    syncPasswords();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    setButtonLoading(submitButton, true, "Создаём аккаунт...");

    try {
      const email = document.getElementById("regEmail").value.trim().toLowerCase();
      const existingUsers = await apiFetch(`/users?email=${encodeURIComponent(email)}`);

      if (existingUsers.length > 0) {
        throw new Error("Пользователь с таким email уже зарегистрирован.");
      }

      const payload = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email,
        password: passwordInput.value,
        role: document.getElementById("role").value,
        experience: document.getElementById("experience").value,
      };

      const createdUser = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSession(createdUser);
      successText.textContent = `Аккаунт ${createdUser.firstName} ${createdUser.lastName} создан и сохранён в API.`;
      showModal("registerSuccessModal");
      window.setTimeout(() => redirectTo("dashboard.html"), 900);
    } catch (error) {
      renderAlert(alertContainer, "danger", error.message || "Не удалось зарегистрировать пользователя.");
    } finally {
      form.classList.add("was-validated");
      setButtonLoading(submitButton, false, "Зарегистрироваться");
    }
  });
}

async function initDashboardPage() {
  try {
    const session = getSession();
    const [user, projects, tasks, workers, qualityStats] = await Promise.all([
      apiFetch(`/users/${session.userId}`),
      apiFetch("/projects"),
      apiFetch("/tasks"),
      apiFetch("/workers"),
      apiFetch("/qualityStats/1"),
    ]);

    renderDashboard(user, projects, tasks, workers, qualityStats);
  } catch (error) {
    renderDashboardError(error);
  }
}

function renderDashboard(user, projects, tasks, workers, qualityStats) {
  const activeProjects = projects.length;
  const activeTasks = tasks.reduce((sum, task) => sum + task.progressTotal, 0);
  const averageQuality = average(projects.map((project) => project.quality));
  const newWorkers = workers.filter((worker) => worker.isNew).length;

  document.getElementById("dashboard-user-name").textContent = `${user.firstName} ${user.lastName}, ${user.role.toLowerCase()}`;
  document.getElementById(
    "dashboard-user-summary"
  ).innerHTML = `Ведёте ${activeProjects} активных проекта. Средний показатель качества команды за 30 дней: <strong>${formatPercent(
    averageQuality
  )}</strong>.`;
  document.getElementById("metric-active-projects").textContent = String(activeProjects);
  document.getElementById("metric-active-tasks").textContent = String(activeTasks);
  document.getElementById("metric-average-quality").textContent = formatPercent(averageQuality);
  document.getElementById("metric-new-workers").textContent = String(newWorkers);

  const rows = projects
    .map((project) => {
      const badgeVariant = getQualityBadgeVariant(project.quality);
      return `
        <tr>
          <th scope="row">${escapeHtml(project.dashboardTitle)}</th>
          <td>${escapeHtml(project.type)}</td>
          <td>
            <div class="progress" role="progressbar" aria-label="progress ${project.progress}" aria-valuenow="${project.progress}" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-bar ${project.progress >= 70 ? "bg-success" : project.progress >= 40 ? "" : "bg-info"}" style="width: ${project.progress}%">${project.progress}%</div>
            </div>
          </td>
          <td><span class="badge text-bg-${badgeVariant}">${project.quality}%</span></td>
        </tr>
      `;
    })
    .join("");

  document.getElementById("dashboard-projects-body").innerHTML = rows;
  setProgressValue("dashboard-validation-wrapper", "dashboard-validation", qualityStats.validation);
  setProgressValue("dashboard-recheck-wrapper", "dashboard-recheck", qualityStats.recheck);
  setProgressValue("dashboard-sla-wrapper", "dashboard-sla", qualityStats.sla);
}

function renderDashboardError(error) {
  const message = getApiErrorMessage(error);
  document.getElementById("dashboard-user-name").textContent = "Не удалось загрузить кабинет";
  document.getElementById("dashboard-user-summary").textContent = message;
  document.getElementById("dashboard-projects-body").innerHTML =
    '<tr><td colspan="4" class="text-danger">API недоступен. Проверьте запуск json-server.</td></tr>';
}

async function initSearchPage() {
  try {
    const projects = await apiFetch("/projects");
    renderSearchProjects(projects);
    initSearchFilters(projects.length);
  } catch (error) {
    const container = document.getElementById("search-results");
    if (container) {
      container.innerHTML = `<div class="glass-card p-4 text-danger">${escapeHtml(getApiErrorMessage(error))}</div>`;
    }
  }
}

function renderSearchProjects(projects) {
  const container = document.getElementById("search-results");
  const emptyState = document.getElementById("empty-results");

  if (!container || !emptyState) {
    return;
  }

  container.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card p-4 bg-white" data-status="${escapeHtml(project.status)}" data-type="${escapeHtml(
          project.typeCode
        )}" data-worker="${escapeHtml(project.worker)}">
          <div class="d-flex flex-wrap justify-content-between gap-2 mb-2">
            <h3 class="h5 mb-0">${escapeHtml(project.title)}</h3>
            <span class="badge text-bg-${escapeHtml(project.statusVariant)}">${escapeHtml(project.statusLabel)}</span>
          </div>
          <p class="text-secondary mb-2">
            Тип: ${escapeHtml(project.type)} | Дедлайн: ${formatDate(project.deadline)} | Исполнитель: ${escapeHtml(project.worker)}
          </p>
          <a class="btn btn-sm btn-brand" href="task.html?id=${project.taskId}">Открыть задачу</a>
        </article>
      `
    )
    .join("");

  container.appendChild(emptyState);
  document.getElementById("search-summary").textContent = `Показано ${projects.length} проектов из мокового API.`;
}

function initSearchFilters(totalProjects) {
  const form = document.getElementById("search-filter-form");
  const emptyState = document.getElementById("empty-results");
  const resetButton = document.getElementById("reset-filters");

  if (!form || !emptyState || !resetButton) {
    return;
  }

  const applyFilters = () => {
    const cards = Array.from(document.querySelectorAll(".project-card"));
    const status = document.getElementById("filter-status").value;
    const annotationType = document.getElementById("filter-type").value;
    const worker = document.getElementById("filter-worker").value.trim().toLowerCase();

    let visibleCount = 0;

    cards.forEach((card) => {
      const statusMatch = !status || card.dataset.status === status;
      const typeMatch = !annotationType || card.dataset.type === annotationType;
      const workerMatch = !worker || card.dataset.worker.toLowerCase().includes(worker);
      const isVisible = statusMatch && typeMatch && workerMatch;

      card.classList.toggle("d-none", !isVisible);
      if (isVisible) {
        visibleCount += 1;
      }
    });

    emptyState.classList.toggle("d-none", visibleCount !== 0);
    document.getElementById("search-summary").textContent = `Показано ${visibleCount} из ${totalProjects} проектов.`;
  };

  form.addEventListener("input", applyFilters);
  form.addEventListener("change", applyFilters);
  resetButton.addEventListener("click", () => {
    form.reset();
    applyFilters();
  });

  applyFilters();
}

async function initTaskPage() {
  try {
    const taskId = Number.parseInt(new URLSearchParams(window.location.search).get("id"), 10) || 1;
    const task = await apiFetch(`/tasks/${taskId}`);
    const project = await apiFetch(`/projects/${task.projectId}`);

    renderTaskPage(task, project);
    initTaskSubmission(task, project);
  } catch (error) {
    document.getElementById("task-title").textContent = "Не удалось загрузить задачу";
    document.getElementById("task-instruction").textContent = getApiErrorMessage(error);
  }
}

function renderTaskPage(task, project) {
  document.getElementById("task-title").textContent = task.title;
  document.getElementById("task-instruction").textContent = task.instruction;
  document.getElementById("task-assignee").textContent = task.assignee;
  document.getElementById("task-progress").textContent = `${task.progressCompleted}/${task.progressTotal} кадров`;
  document.getElementById("task-deadline").textContent = task.dueDate;
  document.getElementById(
    "annotation-canvas"
  ).textContent = `Viewer area: данные для проекта "${project.dashboardTitle}" загружены из API.`;

  document.getElementById("task-tools").innerHTML = task.annotationTools
    .map(
      (tool, index) => `
        <button type="button" class="btn btn-outline-brand ${index === 0 ? "active" : ""}" data-tool="${escapeHtml(tool)}">
          ${escapeHtml(tool)}
        </button>
      `
    )
    .join("");

  document.getElementById("task-files").innerHTML = task.files
    .map(
      (file) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${escapeHtml(file.name)}
          <span class="badge text-bg-secondary">${escapeHtml(file.size)}</span>
        </li>
      `
    )
    .join("");

  document.getElementById("task-steps").innerHTML = task.instructions
    .map((step) => `<li class="mb-2">${escapeHtml(step)}</li>`)
    .join("");

  document.getElementById("active-tool-label").textContent = task.annotationTools[0] || "Не выбран";

  if (task.status === "review") {
    document.getElementById("submit-task-text").textContent = "Задача уже находится на проверке.";
    document.getElementById("confirm-submit-task").textContent = "Уже отправлено";
    document.getElementById("confirm-submit-task").disabled = true;
  }

  initToolButtons();
}

function initToolButtons() {
  const toolButtons = Array.from(document.querySelectorAll("[data-tool]"));
  const toolLabel = document.getElementById("active-tool-label");

  if (!toolButtons.length || !toolLabel) {
    return;
  }

  toolButtons.forEach((button) => {
    button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");
    button.addEventListener("click", () => {
      toolButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      toolButtons.forEach((item) => item.setAttribute("aria-pressed", item === button ? "true" : "false"));
      toolLabel.textContent = button.dataset.tool;
    });
  });
}

function initTaskSubmission(task, project) {
  const submitButton = document.getElementById("confirm-submit-task");
  const submitText = document.getElementById("submit-task-text");

  if (!submitButton || !submitText || submitButton.disabled) {
    return;
  }

  submitButton.addEventListener("click", async () => {
    setButtonLoading(submitButton, true, "Отправляем...");

    try {
      await Promise.all([
        apiFetch(`/tasks/${task.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "review" }),
        }),
        apiFetch(`/projects/${project.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            status: "review",
            statusLabel: "На проверке",
            statusVariant: "success",
          }),
        }),
      ]);

      submitText.textContent = "Задача успешно передана валидатору. Статус обновлён в моковом API.";
      submitButton.textContent = "Отправлено";
      submitButton.disabled = true;

      const modal = bootstrap.Modal.getInstance(document.getElementById("submitTaskModal"));
      window.setTimeout(() => {
        if (modal) {
          modal.hide();
        }
      }, 900);
    } catch (error) {
      submitText.textContent = getApiErrorMessage(error);
      setButtonLoading(submitButton, false, "Подтвердить");
    }
  });
}

async function initWorkersPage() {
  const autoAssignButton = document.getElementById("auto-assign-btn");

  try {
    let [workers, summary] = await Promise.all([apiFetch("/workers"), apiFetch("/teamSummary/1")]);
    renderWorkersPage(workers, summary);

    if (!autoAssignButton) {
      return;
    }

    autoAssignButton.addEventListener("click", async () => {
      setButtonLoading(autoAssignButton, true, "Распределяем...");

      try {
        const updatedSummary = await apiFetch("/teamSummary/1", {
          method: "PATCH",
          body: JSON.stringify({
            assignedCount: summary.assignedCount + 5,
            pendingValidation: summary.pendingValidation + 2,
          }),
        });

        const updatedWorkers = await Promise.all(
          workers.map((worker, index) => {
            if (index > 2) {
              return worker;
            }

            return apiFetch(`/workers/${worker.id}`, {
              method: "PATCH",
              body: JSON.stringify({ currentLoad: worker.currentLoad + (index === 0 ? 2 : 1) }),
            });
          })
        );

        summary = updatedSummary;
        workers = updatedWorkers;
        renderWorkersPage(updatedWorkers, updatedSummary);

        const toastNode = document.getElementById("action-toast");
        if (toastNode) {
          bootstrap.Toast.getOrCreateInstance(toastNode).show();
        }
      } catch (error) {
        alert(getApiErrorMessage(error));
      } finally {
        setButtonLoading(autoAssignButton, false, "Автораспределение задач");
      }
    });
  } catch (error) {
    const tbody = document.getElementById("workers-table-body");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-danger">${escapeHtml(getApiErrorMessage(error))}</td></tr>`;
    }
  }
}

function renderWorkersPage(workers, summary) {
  document.getElementById("assigned-count").textContent = String(summary.assignedCount);
  document.getElementById("qa-score").textContent = formatPercent(summary.qaScore);
  document.getElementById("pending-validation").textContent = String(summary.pendingValidation);
  document.getElementById("workers-table-body").innerHTML = workers
    .map(
      (worker) => `
        <tr>
          <th scope="row">${escapeHtml(worker.name)}</th>
          <td>${escapeHtml(worker.role)}</td>
          <td>${worker.currentLoad} задач</td>
          <td><span class="badge text-bg-${getQualityBadgeVariant(worker.quality)}">${worker.quality}%</span></td>
          <td><button class="btn btn-sm btn-outline-brand" type="button">${escapeHtml(worker.actionLabel)}</button></td>
        </tr>
      `
    )
    .join("");
}

async function apiFetch(path, options = {}) {
  const hasBody = options.body !== undefined && options.body !== null;
  const requestOptions = {
    method: options.method || "GET",
    headers: {
      ...(options.headers || {}),
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
    },
    ...(hasBody ? { body: options.body } : {}),
  };

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, requestOptions);
  } catch (error) {
    throw new Error("Не удалось подключиться к API. Убедитесь, что json-server запущен на http://localhost:3000.");
  }

  if (!response.ok) {
    throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function updateNavbar(user) {
  const navList = document.querySelector(".navbar-nav");
  if (!navList || navList.dataset.authApplied === "true") {
    return;
  }

  navList.dataset.authApplied = "true";

  navList.querySelectorAll('a[href="login.html"], a[href="register.html"]').forEach((link) => {
    const item = link.closest("li");
    if (item) {
      item.remove();
    }
  });

  const userItem = document.createElement("li");
  userItem.className = "nav-item d-flex align-items-center";
  userItem.innerHTML = `<span class="nav-link disabled">Пользователь: ${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}</span>`;

  const logoutItem = document.createElement("li");
  logoutItem.className = "nav-item";
  logoutItem.innerHTML = '<button type="button" class="btn btn-sm btn-outline-brand ms-lg-2 d-flex align-items-center gap-1" id="logout-button"><svg class="nav-icon" aria-hidden="true"><use href="img/icons.svg#icon-logout"/></svg>Выйти</button>';

  navList.appendChild(userItem);
  navList.appendChild(logoutItem);

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      clearSession();
      redirectTo("login.html");
    });
  }
}

function setSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      userId: user.id,
      token: `mock-token-${user.id}-${Date.now()}`,
    })
  );
}

function getSession() {
  try {
    const rawValue = localStorage.getItem(SESSION_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    clearSession();
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function renderBootstrapError(error) {
  const message = escapeHtml(getApiErrorMessage(error));
  const fallback = document.createElement("div");
  fallback.className = "container py-4";
  fallback.innerHTML = `
    <div class="alert alert-danger" role="alert">
      <strong>Не удалось инициализировать приложение.</strong><br />
      ${message}<br />
      Запустите API командой <code>npm run api</code> или <code>npm run dev</code>.
    </div>
  `;

  const main = document.querySelector("main");
  if (main) {
    main.prepend(fallback);
    return;
  }

  document.body.prepend(fallback);
}

function showModal(modalId) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) {
    return;
  }

  bootstrap.Modal.getOrCreateInstance(modalElement).show();
}

function renderAlert(container, type, message) {
  container.innerHTML = `<div class="alert alert-${type}" role="alert">${escapeHtml(message)}</div>`;
}

function clearAlerts(container) {
  container.innerHTML = "";
}

function setButtonLoading(button, isLoading, label) {
  button.disabled = isLoading;
  button.setAttribute("aria-busy", isLoading ? "true" : "false");
  button.textContent = label;
}

function setProgressValue(wrapperId, barId, value) {
  const wrapper = document.getElementById(wrapperId);
  const bar = document.getElementById(barId);

  if (!wrapper || !bar) {
    return;
  }

  wrapper.setAttribute("aria-valuenow", String(value));
  bar.style.width = `${value}%`;
  bar.textContent = `${value}%`;
}

function getCurrentPage() {
  const page = window.location.pathname.split("/").pop();
  return page || "index.html";
}

function redirectTo(path) {
  window.location.href = path;
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU").format(date);
}

function formatPercent(value) {
  return `${Number(value).toFixed(1).replace(".0", "")}%`;
}

function average(values) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getQualityBadgeVariant(value) {
  if (value >= 95) {
    return "success";
  }

  if (value >= 90) {
    return "primary";
  }

  return "warning";
}

function getApiErrorMessage(error) {
  return error?.message || "Не удалось получить данные от API.";
}

async function ensureApiIsAvailable(currentPage) {
  try {
    await apiFetch("/users?_limit=1");
  } catch (error) {
    const needsApi = PROTECTED_PAGES.has(currentPage) || currentPage === "login.html" || currentPage === "register.html";
    if (needsApi) {
      throw error;
    }
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
