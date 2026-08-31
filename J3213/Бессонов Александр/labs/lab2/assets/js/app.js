"use strict";

const api = window.TPulseApi;

const priorityLabels = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий"
};

const priorityCodes = {
  "Высокий": "high",
  "Средний": "medium",
  "Низкий": "low"
};

const statusMeta = {
  todo: { label: "Запланировано", className: "status-planning" },
  progress: { label: "В работе", className: "status-active" },
  review: { label: "На проверке", className: "status-review" },
  done: { label: "Готово", className: "status-active" },
  backlog: { label: "Бэклог", className: "status-planning" }
};

const typeMeta = {
  "История": { className: "task-type-story", icon: "bi-bookmark-check" },
  "Разработка": { className: "task-type-dev", icon: "bi-code-slash" },
  "Дизайн": { className: "task-type-design", icon: "bi-palette" },
  "Ошибка": { className: "task-type-bug", icon: "bi-bug" },
  "Контент": { className: "task-type-content", icon: "bi-file-text" },
  "Исследование": { className: "task-type-research", icon: "bi-lightbulb" },
  "Задача": { className: "task-type-dev", icon: "bi-check2-square" }
};

const assignees = {
  "Александр Б.": { code: "alex", initials: "АБ", avatar: "lime" },
  "Мария С.": { code: "maria", initials: "МС", avatar: "pink" },
  "Илья В.": { code: "ilya", initials: "ИВ", avatar: "blue" },
  "Анна К.": { code: "anna", initials: "АК", avatar: "lime" }
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  const toastElement = document.getElementById("appToast");
  if (!toastElement) return;

  toastElement.querySelector("[data-toast-message]").textContent = message;
  bootstrap.Toast.getOrCreateInstance(toastElement).show();
}

function showFormError(form, message) {
  let alert = form.querySelector("[data-form-error]");
  if (!alert) {
    alert = document.createElement("div");
    alert.className = "alert alert-danger mt-3 mb-0";
    alert.dataset.formError = "";
    alert.setAttribute("role", "alert");
    form.append(alert);
  }
  alert.textContent = message;
}

function setSubmitState(form, loading, text) {
  const button = form.querySelector('button[type="submit"]');
  if (!button) return;

  if (loading) {
    button.dataset.originalHtml = button.innerHTML;
    button.disabled = true;
    button.textContent = text;
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalHtml || button.innerHTML;
  }
}

function getCurrentUser() {
  return api?.getCurrentUser() || null;
}

function hydrateCurrentUser() {
  const user = getCurrentUser();
  if (!user) return;

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const shortName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName[0]}.` : fullName;
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  const workspaceName = user.workspaceName || "Рабочее пространство";
  const workspaceCode = workspaceName.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase();

  document.querySelectorAll(".sidebar-profile .user-avatar").forEach((element) => { element.textContent = initials; });
  document.querySelectorAll(".sidebar-profile strong").forEach((element) => { element.textContent = shortName; });
  document.querySelectorAll(".sidebar-profile small").forEach((element) => { element.textContent = user.role || "Администратор"; });
  document.querySelectorAll(".workspace-switcher strong").forEach((element) => { element.textContent = workspaceName; });
  document.querySelectorAll(".workspace-switcher .workspace-logo").forEach((element) => { element.textContent = workspaceCode; });

  const topbarTitle = document.querySelector(".app-topbar > div > strong");
  if (topbarTitle?.textContent.trim() === "Digital Lab") topbarTitle.textContent = workspaceName;
}

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable;

  if (event.key === "/" && !isTyping && document.body.classList.contains("app-page")) {
    event.preventDefault();
    window.location.href = "search.html";
  }
});

document.querySelectorAll("[data-password-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.passwordToggle);
    const icon = button.querySelector("i");
    const passwordVisible = input.type === "text";

    input.type = passwordVisible ? "password" : "text";
    icon.className = passwordVisible ? "bi bi-eye" : "bi bi-eye-slash";
    button.setAttribute("aria-label", passwordVisible ? "Показать пароль" : "Скрыть пароль");
  });
});

document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  setSubmitState(form, true, "Входим...");
  form.querySelector("[data-form-error]")?.remove();

  try {
    await api.login(
      document.getElementById("loginEmail").value.trim(),
      document.getElementById("loginPassword").value,
      document.getElementById("rememberMe").checked
    );
    window.location.href = "dashboard.html";
  } catch (error) {
    const message = /Cannot find user|Incorrect password/i.test(error.message)
      ? "Неверная электронная почта или пароль."
      : error.message;
    showFormError(form, message);
  } finally {
    setSubmitState(form, false);
  }
});

document.getElementById("registerForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  setSubmitState(form, true, "Создаём пространство...");
  form.querySelector("[data-form-error]")?.remove();

  try {
    await api.register({
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("registerEmail").value.trim(),
      workspaceName: document.getElementById("workspaceName").value.trim(),
      password: document.getElementById("registerPassword").value,
      role: "Администратор"
    });
    window.location.href = "dashboard.html";
  } catch (error) {
    const message = /Email already exists/i.test(error.message)
      ? "Пользователь с такой электронной почтой уже существует."
      : error.message;
    showFormError(form, message);
  } finally {
    setSubmitState(form, false);
  }
});

document.querySelector("[data-restore-password]")?.addEventListener("click", () => {
  bootstrap.Modal.getInstance(document.getElementById("restoreModal"))?.hide();
  showToast("Ссылка для восстановления отправлена");
});

document.querySelectorAll(".sidebar-profile a[href='index.html']").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    api.logout();
    window.location.href = "index.html";
  });
});

document.querySelectorAll("[data-complete-task]").forEach((button) => {
  button.addEventListener("click", () => {
    const taskMain = button.closest(".task-row")?.querySelector(".task-main");
    const completed = button.classList.toggle("is-complete");
    taskMain?.classList.toggle("is-complete", completed);
    button.setAttribute("aria-label", completed ? "Вернуть задачу в работу" : "Отметить задачу выполненной");
  });
});

document.querySelector("[data-mark-read]")?.addEventListener("click", (event) => {
  document.querySelectorAll(".notification-list .unread").forEach((item) => item.classList.remove("unread"));
  event.currentTarget.textContent = "Все уведомления прочитаны";
  document.querySelector(".has-indicator")?.classList.remove("has-indicator");
});

const searchForm = document.getElementById("searchFilters");

function filterSearchResults() {
  if (!searchForm) return;

  const query = document.getElementById("searchQuery").value.trim().toLowerCase();
  const status = document.getElementById("statusFilter").value;
  const priority = document.getElementById("priorityFilter").value;
  const assignee = document.getElementById("assigneeFilter").value;
  let visibleCount = 0;

  document.querySelectorAll("[data-search-item]").forEach((item) => {
    const matchesQuery = item.dataset.title.toLowerCase().includes(query);
    const matchesStatus = !status || item.dataset.status === status;
    const matchesPriority = !priority || item.dataset.priority === priority;
    const matchesAssignee = !assignee || item.dataset.assignee === assignee;
    const visible = matchesQuery && matchesStatus && matchesPriority && matchesAssignee;

    item.classList.toggle("d-none", !visible);
    if (visible) visibleCount += 1;
  });

  document.getElementById("resultCount").textContent = visibleCount;
  document.getElementById("emptyResults")?.classList.toggle("d-none", visibleCount !== 0);
}

function renderSearchItem(task) {
  const state = task.status === "todo" ? "planned" : task.status;
  const status = statusMeta[task.status] || statusMeta.todo;
  const priority = priorityLabels[task.priority] || priorityLabels.medium;
  const projectName = task.projectId === 2 ? "Редизайн сайта" : "Мобильное приложение";

  return `<article class="result-card" data-search-item data-title="${escapeHtml(task.title)}" data-status="${state}" data-priority="${escapeHtml(task.priority)}" data-assignee="${escapeHtml(task.assigneeCode)}">
    <span class="result-icon"><i class="bi bi-check2-square"></i></span>
    <div><h3>${escapeHtml(task.title)}</h3><p>${escapeHtml(projectName)} · ${escapeHtml(task.type)}</p></div>
    <span class="status-pill ${status.className}">${status.label}</span>
    <span class="priority-badge priority-${escapeHtml(task.priority)}-bg">${priority}</span>
    <div class="result-assignee"><span class="activity-avatar avatar-${escapeHtml(task.avatar)}">${escapeHtml(task.initials)}</span>${escapeHtml(task.assignee.split(" ")[0])}</div>
    <span class="result-date"><i class="bi bi-calendar3"></i> ${escapeHtml(task.due)}</span>
  </article>`;
}

async function loadSearchTasks() {
  if (!searchForm) return;
  const user = getCurrentUser();
  const tasks = await api.getTasks({ userId: user.id, _sort: "id", _order: "desc" });
  document.getElementById("searchResults").innerHTML = tasks.map(renderSearchItem).join("");
  filterSearchResults();
}

searchForm?.querySelectorAll("input, select").forEach((control) => {
  control.addEventListener("input", filterSearchResults);
  control.addEventListener("change", filterSearchResults);
});

searchForm?.addEventListener("reset", () => window.setTimeout(filterSearchResults, 0));

document.querySelector("[data-empty-reset]")?.addEventListener("click", () => {
  searchForm.reset();
  filterSearchResults();
});

document.querySelectorAll(".view-switch button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".view-switch button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

document.querySelector("[data-save-filter]")?.addEventListener("click", () => {
  const name = document.getElementById("filterName").value.trim();
  if (!name) {
    document.getElementById("filterName").focus();
    return;
  }

  bootstrap.Modal.getInstance(document.getElementById("savedFilterModal"))?.hide();
  showToast(`Фильтр «${name}» сохранён`);
});

document.querySelector("[data-favorite]")?.addEventListener("click", (event) => {
  const button = event.currentTarget;
  const icon = button.querySelector("i");
  const active = icon.classList.toggle("bi-star-fill");
  icon.classList.toggle("bi-star", !active);
  button.classList.toggle("btn-warning", active);
  showToast(active ? "Проект добавлен в избранное" : "Проект удалён из избранного");
});

const kanbanBoard = document.getElementById("kanbanBoard");
const boardSearch = document.getElementById("boardSearch");
const boardAssigneeFilter = document.getElementById("boardAssigneeFilter");
const boardPriorityFilter = document.getElementById("boardPriorityFilter");
let draggedKanbanCard = null;
let cardWasMoved = false;

function renderKanbanCard(task) {
  const type = typeMeta[task.type] || typeMeta["Задача"];
  const priority = priorityLabels[task.priority] || priorityLabels.medium;
  const labels = (task.labels || []).map((label) => `<span>${escapeHtml(label)}</span>`).join("");
  const dueClass = task.status === "done" ? "is-done" : task.due === "Сегодня" ? "is-overdue" : "";
  const dueIcon = task.status === "done" ? "bi-check2-circle" : task.due === "Сегодня" ? "bi-clock" : "bi-calendar3";

  const card = document.createElement("article");
  card.className = `kanban-card priority-${task.priority}`;
  card.draggable = true;
  card.tabIndex = 0;
  card.dataset.kanbanCard = "";
  card.dataset.recordId = task.id;
  card.dataset.taskId = task.key;
  card.dataset.taskType = task.type;
  card.dataset.priority = priority;
  card.dataset.assignee = task.assignee;
  card.dataset.due = task.due;
  card.innerHTML = `<div class="kanban-card-top"><span class="task-type ${type.className}"><i class="bi ${type.icon}"></i> ${escapeHtml(task.type)}</span><span class="kanban-card-key">${escapeHtml(task.key)}</span></div>
    <h4>${escapeHtml(task.title)}</h4>
    <div class="kanban-labels">${labels}</div>
    <div class="kanban-card-footer"><span class="task-priority ${escapeHtml(task.priority)}" title="${priority} приоритет"><i class="bi bi-arrow-up"></i></span><span class="task-due ${dueClass}"><i class="bi ${dueIcon}"></i> ${escapeHtml(task.due)}</span><span class="activity-avatar avatar-${escapeHtml(task.avatar)}" title="${escapeHtml(task.assignee)}">${escapeHtml(task.initials)}</span></div>`;
  return card;
}

function updateKanbanCounts() {
  if (!kanbanBoard) return;
  let total = 0;
  kanbanBoard.querySelectorAll("[data-kanban-column]").forEach((column) => {
    const count = column.querySelectorAll("[data-kanban-card]").length;
    column.querySelector(".kanban-count").textContent = count;
    total += count;
  });
  document.getElementById("boardVisibleCount").textContent = total;
}

function filterKanbanCards() {
  if (!kanbanBoard) return;

  const query = boardSearch.value.trim().toLowerCase();
  const assignee = boardAssigneeFilter.value;
  const priority = boardPriorityFilter.value;
  let visibleCount = 0;

  kanbanBoard.querySelectorAll("[data-kanban-card]").forEach((card) => {
    const title = card.querySelector("h4").textContent.toLowerCase();
    const key = card.dataset.taskId.toLowerCase();
    const visible = (!query || title.includes(query) || key.includes(query))
      && (!assignee || card.dataset.assignee === assignee)
      && (!priority || card.dataset.priority === priority);

    card.classList.toggle("is-filtered", !visible);
    if (visible) visibleCount += 1;
  });

  document.getElementById("boardVisibleCount").textContent = visibleCount;
}

async function loadKanbanTasks() {
  if (!kanbanBoard) return;
  const user = getCurrentUser();
  const tasks = await api.getTasks({ userId: user.id, scope: "board", _sort: "id", _order: "desc" });

  kanbanBoard.querySelectorAll("[data-dropzone]").forEach((dropzone) => { dropzone.innerHTML = ""; });
  tasks.forEach((task) => {
    kanbanBoard.querySelector(`[data-dropzone="${task.status}"]`)?.append(renderKanbanCard(task));
  });
  updateKanbanCounts();
  filterKanbanCards();
}

function openTaskDetails(card) {
  document.getElementById("taskDetailsKey").textContent = card.dataset.taskId;
  document.getElementById("taskDetailsTitle").textContent = card.querySelector("h4").textContent;
  document.getElementById("taskDetailsType").textContent = card.dataset.taskType;
  document.getElementById("taskDetailsPriority").textContent = card.dataset.priority;
  document.getElementById("taskDetailsAssignee").textContent = card.dataset.assignee;
  document.getElementById("taskDetailsDue").textContent = card.dataset.due;
  bootstrap.Modal.getOrCreateInstance(document.getElementById("taskDetailsModal")).show();
}

kanbanBoard?.addEventListener("dragstart", (event) => {
  const card = event.target.closest("[data-kanban-card]");
  if (!card) return;
  draggedKanbanCard = card;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", card.dataset.taskId);
  window.setTimeout(() => card.classList.add("is-dragging"), 0);
});

kanbanBoard?.addEventListener("dragover", (event) => {
  const dropzone = event.target.closest("[data-dropzone]");
  if (!dropzone || !draggedKanbanCard) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  kanbanBoard.querySelectorAll("[data-dropzone]").forEach((item) => item.classList.remove("is-drag-over"));
  dropzone.classList.add("is-drag-over");
});

kanbanBoard?.addEventListener("drop", async (event) => {
  const dropzone = event.target.closest("[data-dropzone]");
  if (!dropzone || !draggedKanbanCard) return;
  event.preventDefault();

  const card = draggedKanbanCard;
  dropzone.append(card);
  cardWasMoved = true;
  updateKanbanCounts();

  try {
    await api.updateTask(card.dataset.recordId, { status: dropzone.dataset.dropzone });
    showToast(`Статус задачи ${card.dataset.taskId} сохранён в API`);
  } catch (error) {
    showToast(error.message);
    await loadKanbanTasks();
  }
});

kanbanBoard?.addEventListener("dragend", () => {
  kanbanBoard.querySelectorAll(".is-dragging, .is-drag-over").forEach((item) => item.classList.remove("is-dragging", "is-drag-over"));
  draggedKanbanCard = null;
  window.setTimeout(() => { cardWasMoved = false; }, 0);
});

kanbanBoard?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-kanban-card]");
  if (card && !cardWasMoved) openTaskDetails(card);
});

kanbanBoard?.addEventListener("keydown", (event) => {
  const card = event.target.closest("[data-kanban-card]");
  if (card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openTaskDetails(card);
  }
});

[boardSearch, boardAssigneeFilter, boardPriorityFilter].forEach((control) => {
  control?.addEventListener("input", filterKanbanCards);
  control?.addEventListener("change", filterKanbanCards);
});

document.querySelector("[data-board-reset]")?.addEventListener("click", () => {
  boardSearch.value = "";
  boardAssigneeFilter.value = "";
  boardPriorityFilter.value = "";
  filterKanbanCards();
});

const backlogSearch = document.getElementById("backlogSearch");
const backlogPriorityFilter = document.getElementById("backlogPriorityFilter");
const backlogAssigneeFilter = document.getElementById("backlogAssigneeFilter");

function filterBacklogItems() {
  if (!backlogSearch) return;
  const query = backlogSearch.value.trim().toLowerCase();
  const priority = backlogPriorityFilter.value;
  const assignee = backlogAssigneeFilter.value;
  let visibleCount = 0;

  document.querySelectorAll("[data-backlog-item]").forEach((item) => {
    const visible = (!query || item.dataset.title.toLowerCase().includes(query) || item.dataset.key.toLowerCase().includes(query))
      && (!priority || item.dataset.priority === priority)
      && (!assignee || item.dataset.assignee === assignee);
    item.classList.toggle("is-filtered", !visible);
    if (visible) visibleCount += 1;
  });

  document.getElementById("backlogVisibleCount").textContent = visibleCount;
  document.getElementById("backlogEmpty")?.classList.toggle("d-none", visibleCount !== 0);
}

function renderBacklogItem(task) {
  const priority = priorityLabels[task.priority] || priorityLabels.medium;
  const type = typeMeta[task.type] || typeMeta["Задача"];
  const item = document.createElement("article");
  item.className = "backlog-item";
  item.dataset.backlogItem = "";
  item.dataset.title = task.title;
  item.dataset.key = task.key;
  item.dataset.priority = priority;
  item.dataset.assignee = task.assignee;
  item.innerHTML = `<span class="backlog-handle"><i class="bi bi-grip-vertical"></i></span><span class="backlog-type task"><i class="bi ${type.icon}"></i></span><div class="backlog-task-main"><span>${escapeHtml(task.key)}</span><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml((task.labels || []).join(" · ") || task.type)}</small></div><span class="priority-badge priority-${escapeHtml(task.priority)}-bg">${priority}</span><span class="backlog-assignee"><span class="activity-avatar avatar-${escapeHtml(task.avatar)}">${escapeHtml(task.initials)}</span><span>${escapeHtml(task.assignee)}</span></span><span class="story-points">${escapeHtml(task.points)}</span><button class="btn icon-btn btn-sm" type="button" aria-label="Действия задачи"><i class="bi bi-three-dots"></i></button>`;
  return item;
}

async function loadBacklogTasks() {
  if (!backlogSearch) return;
  const user = getCurrentUser();
  const tasks = await api.getTasks({ userId: user.id, _sort: "id", _order: "desc" });
  const sprintTasks = tasks.filter((task) => task.scope === "board" && !["done"].includes(task.status));
  const backlogTasks = tasks.filter((task) => task.status === "backlog");
  const sprintList = document.getElementById("sprintList");
  const productList = document.getElementById("productBacklogList");

  sprintList.innerHTML = "";
  productList.innerHTML = "";
  sprintTasks.forEach((task) => sprintList.append(renderBacklogItem(task)));
  backlogTasks.forEach((task) => productList.append(renderBacklogItem(task)));
  document.getElementById("productBacklogCount").textContent = backlogTasks.length;
  filterBacklogItems();
}

[backlogSearch, backlogPriorityFilter, backlogAssigneeFilter].forEach((control) => {
  control?.addEventListener("input", filterBacklogItems);
  control?.addEventListener("change", filterBacklogItems);
});

document.querySelectorAll("[data-backlog-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const list = document.getElementById(button.dataset.backlogToggle);
    const expanded = button.getAttribute("aria-expanded") === "true";
    list.classList.toggle("is-collapsed", expanded);
    button.setAttribute("aria-expanded", String(!expanded));
  });
});

document.getElementById("backlogTaskForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const title = document.getElementById("backlogTaskName").value.trim();
  const priorityLabel = document.getElementById("backlogTaskPriority").value;
  const assignee = document.getElementById("backlogTaskAssignee").value;
  const points = Number(document.getElementById("backlogTaskPoints").value);
  const assigneeData = assignees[assignee] || assignees["Александр Б."];
  const user = getCurrentUser();

  if (!title) return;
  setSubmitState(form, true, "Сохраняем...");

  try {
    await api.createTask({
      projectId: user.projectId,
      userId: user.id,
      title,
      type: "Задача",
      status: "backlog",
      priority: priorityCodes[priorityLabel],
      assignee,
      assigneeCode: assigneeData.code,
      initials: assigneeData.initials,
      avatar: assigneeData.avatar,
      due: "Без срока",
      labels: ["Новая задача"],
      points,
      scope: "backlog"
    });
    bootstrap.Modal.getInstance(document.getElementById("backlogTaskModal"))?.hide();
    form.reset();
    await loadBacklogTasks();
    showToast("Задача добавлена в API и появилась в бэклоге");
  } catch (error) {
    showToast(error.message);
  } finally {
    setSubmitState(form, false);
  }
});

const createTaskRequest = new URLSearchParams(window.location.search).get("create");
const backlogTaskModal = document.getElementById("backlogTaskModal");

if (createTaskRequest === "task" && backlogTaskModal) {
  bootstrap.Modal.getOrCreateInstance(backlogTaskModal).show();
  window.history.replaceState({}, "", window.location.pathname);
}

document.querySelector("[data-upload-file]")?.addEventListener("click", () => {
  showToast("Загрузка файлов будет подключена к API на следующем этапе");
});

function renderComment(comment) {
  const article = document.createElement("article");
  article.className = "discussion-item";
  article.innerHTML = `<span class="activity-avatar avatar-${escapeHtml(comment.avatar || "lime")}">${escapeHtml(comment.initials)}</span><div><div><strong>${escapeHtml(comment.author)}</strong><small class="text-secondary ms-2">${comment.createdAt ? new Date(comment.createdAt).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Только что"}</small></div><p>${escapeHtml(comment.text)}</p></div>`;
  return article;
}

async function loadComments() {
  const list = document.getElementById("discussionList");
  if (!list) return;
  const user = getCurrentUser();
  const comments = await api.getComments({ projectId: user.projectId, _sort: "createdAt", _order: "asc" });
  list.innerHTML = "";
  comments.forEach((comment) => list.append(renderComment(comment)));
}

document.getElementById("commentForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const input = document.getElementById("commentText");
  const text = input.value.trim();
  const user = getCurrentUser();
  if (!text) return;

  try {
    await api.createComment({
      projectId: user.projectId,
      userId: user.id,
      author: `${user.firstName} ${user.lastName}`,
      initials: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),
      avatar: "lime",
      text,
      createdAt: new Date().toISOString()
    });
    form.reset();
    await loadComments();
    showToast("Комментарий сохранён в API");
  } catch (error) {
    showToast(error.message);
  }
});

function renderMember(member, currentUser) {
  const isCurrentUser = member.userId === currentUser.id;
  const statusClass = member.status === "Онлайн" ? "status-active" : "status-planning";
  return `<tr data-member-name="${escapeHtml(member.name)}"><td><div class="member-cell"><span class="activity-avatar avatar-${escapeHtml(member.avatar)}">${escapeHtml(member.initials)}</span><div><strong>${escapeHtml(member.name)}</strong><span>${escapeHtml(member.email)}</span></div></div></td><td class="hide-mobile">${escapeHtml(member.projectsCount)} проекта</td><td><select class="form-select form-select-sm role-select" data-role-select data-member-id="${member.id}" ${isCurrentUser ? "disabled" : ""}><option ${member.role === "Администратор" ? "selected" : ""}>Администратор</option><option ${member.role === "Участник" ? "selected" : ""}>Участник</option><option ${member.role === "Наблюдатель" ? "selected" : ""}>Наблюдатель</option></select></td><td class="hide-mobile"><span class="status-pill ${statusClass}">${escapeHtml(member.status)}</span></td><td><button class="btn icon-btn btn-sm" type="button" aria-label="Меню участника"><i class="bi bi-three-dots"></i></button></td></tr>`;
}

async function loadMembers() {
  const table = document.getElementById("membersTable");
  if (!table) return;
  const user = getCurrentUser();
  const members = await api.getMembers({ workspaceId: user.workspaceId, _sort: "id", _order: "asc" });
  table.innerHTML = members.map((member) => renderMember(member, user)).join("");
}

document.getElementById("memberSearch")?.addEventListener("input", (event) => {
  const query = event.currentTarget.value.trim().toLowerCase();
  document.querySelectorAll("#membersTable tr").forEach((row) => {
    row.classList.toggle("d-none", !row.dataset.memberName.toLowerCase().includes(query));
  });
});

document.getElementById("membersTable")?.addEventListener("change", async (event) => {
  const select = event.target.closest("[data-role-select]");
  if (!select) return;
  try {
    await api.updateMember(select.dataset.memberId, { role: select.value });
    showToast(`Роль сохранена в API: ${select.value}`);
  } catch (error) {
    showToast(error.message);
    await loadMembers();
  }
});

document.getElementById("inviteForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const email = document.getElementById("inviteEmail").value.trim();
  const role = document.getElementById("inviteRole").value;
  const name = email.split("@")[0];
  const user = getCurrentUser();

  try {
    await api.createMember({
      workspaceId: user.workspaceId,
      name,
      shortName: name,
      email,
      role,
      status: "Приглашён",
      projectsCount: 0,
      code: `invite-${Date.now()}`,
      initials: name.slice(0, 2).toUpperCase(),
      avatar: "blue"
    });
    bootstrap.Modal.getInstance(document.getElementById("inviteModal"))?.hide();
    form.reset();
    await loadMembers();
    showToast(`Приглашение для ${email} сохранено в API`);
  } catch (error) {
    showToast(error.message);
  }
});

async function initializeApp() {
  const isProtectedPage = document.body.classList.contains("app-page");
  if (isProtectedPage && !api?.isAuthenticated()) {
    window.location.replace("index.html");
    return;
  }

  hydrateCurrentUser();

  const loaders = [];
  if (searchForm) loaders.push(loadSearchTasks());
  if (kanbanBoard) loaders.push(loadKanbanTasks(), loadComments());
  if (backlogSearch) loaders.push(loadBacklogTasks());
  if (document.getElementById("membersTable")) loaders.push(loadMembers());

  const results = await Promise.allSettled(loaders);
  const failed = results.find((result) => result.status === "rejected");
  if (failed) showToast(failed.reason.message || "Не удалось получить данные API");
}

initializeApp();
