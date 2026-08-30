"use strict";

function showToast(message) {
  const toastElement = document.getElementById("appToast");
  if (!toastElement) return;

  const messageElement = toastElement.querySelector("[data-toast-message]");
  messageElement.textContent = message;
  bootstrap.Toast.getOrCreateInstance(toastElement).show();
}

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

document.getElementById("loginForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  window.location.href = "dashboard.html";
});

document.querySelector("[data-restore-password]")?.addEventListener("click", () => {
  const modalElement = document.getElementById("restoreModal");
  bootstrap.Modal.getInstance(modalElement)?.hide();
  showToast("Ссылка для восстановления отправлена");
});

document.getElementById("registerForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  window.location.href = "dashboard.html";
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

document.getElementById("quickTaskForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const title = document.getElementById("quickTaskTitle").value.trim();
  const project = document.getElementById("quickProject").value;
  const priority = document.getElementById("quickPriority").value;

  if (!title) return;

  const priorityClasses = {
    "Высокий": "priority-high-bg",
    "Средний": "priority-medium-bg",
    "Низкий": "priority-low-bg"
  };
  const row = document.createElement("article");
  row.className = "task-row";
  row.innerHTML = '<button class="task-check" type="button" aria-label="Отметить задачу выполненной"><i class="bi bi-check"></i></button><div class="task-main"><strong></strong><span></span></div><span class="priority-badge ' + priorityClasses[priority] + '">' + priority + '</span><span class="task-date">Новая</span>';
  row.querySelector("strong").textContent = title;
  row.querySelector(".task-main span").textContent = project;
  row.querySelector(".task-check").addEventListener("click", (clickEvent) => {
    const taskButton = clickEvent.currentTarget;
    taskButton.classList.toggle("is-complete");
    taskButton.closest(".task-row").querySelector(".task-main").classList.toggle("is-complete");
  });
  document.getElementById("dashboardTaskList")?.prepend(row);
  bootstrap.Modal.getInstance(document.getElementById("taskModal"))?.hide();
  form.reset();
  showToast("Задача добавлена в список");
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
  showToast("Фильтр «" + name + "» сохранён");
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
let kanbanTaskSequence = 134;
let cardWasMoved = false;

function updateKanbanCounts() {
  if (!kanbanBoard) return;

  kanbanBoard.querySelectorAll("[data-kanban-column]").forEach((column) => {
    const count = column.querySelectorAll("[data-kanban-card]").length;
    column.querySelector(".kanban-count").textContent = count;
  });
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

function openTaskDetails(card) {
  document.getElementById("taskDetailsKey").textContent = card.dataset.taskId;
  document.getElementById("taskDetailsTitle").textContent = card.querySelector("h4").textContent;
  document.getElementById("taskDetailsType").textContent = card.dataset.taskType;
  document.getElementById("taskDetailsPriority").textContent = card.dataset.priority;
  document.getElementById("taskDetailsAssignee").textContent = card.dataset.assignee;
  document.getElementById("taskDetailsDue").textContent = card.dataset.due;
  bootstrap.Modal.getOrCreateInstance(document.getElementById("taskDetailsModal")).show();
}

function createKanbanCard({ title, type, priority, assignee, due }) {
  const typeMeta = {
    "Задача": ["task-type-dev", "bi-code-slash"],
    "История": ["task-type-story", "bi-bookmark-check"],
    "Ошибка": ["task-type-bug", "bi-bug"],
    "Исследование": ["task-type-research", "bi-lightbulb"]
  };
  const priorityMeta = {
    "Высокий": ["priority-high", "high", "bi-arrow-up"],
    "Средний": ["priority-medium", "medium", "bi-equals"],
    "Низкий": ["priority-low", "low", "bi-arrow-down"]
  };
  const [typeClass, typeIcon] = typeMeta[type];
  const [priorityClass, priorityIconClass, priorityIcon] = priorityMeta[priority];
  const initials = assignee.split(" ").map((part) => part[0]).join("");
  const key = "TP-" + kanbanTaskSequence;
  const formattedDue = due
    ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(new Date(due + "T00:00:00"))
    : "Без срока";
  kanbanTaskSequence += 1;

  const card = document.createElement("article");
  card.className = "kanban-card " + priorityClass;
  card.draggable = true;
  card.tabIndex = 0;
  card.dataset.kanbanCard = "";
  card.dataset.taskId = key;
  card.dataset.taskType = type;
  card.dataset.priority = priority;
  card.dataset.assignee = assignee;
  card.dataset.due = formattedDue;
  card.innerHTML = '<div class="kanban-card-top"><span class="task-type"><i></i> <span></span></span><span class="kanban-card-key"></span></div><h4></h4><div class="kanban-labels"><span>Новая</span></div><div class="kanban-card-footer"><span class="task-priority" title="Приоритет"><i></i></span><span class="task-due"><i class="bi bi-calendar3"></i> <span></span></span><span class="activity-avatar avatar-lime"></span></div>';
  card.querySelector(".task-type").classList.add(typeClass);
  card.querySelector(".task-type i").className = "bi " + typeIcon;
  card.querySelector(".task-type span").textContent = type;
  card.querySelector(".kanban-card-key").textContent = key;
  card.querySelector("h4").textContent = title;
  card.querySelector(".task-priority").classList.add(priorityIconClass);
  card.querySelector(".task-priority i").className = "bi " + priorityIcon;
  card.querySelector(".task-due span").textContent = formattedDue;
  card.querySelector(".activity-avatar").textContent = initials;
  card.querySelector(".activity-avatar").title = assignee;
  return card;
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

kanbanBoard?.addEventListener("drop", (event) => {
  const dropzone = event.target.closest("[data-dropzone]");
  if (!dropzone || !draggedKanbanCard) return;

  event.preventDefault();
  dropzone.append(draggedKanbanCard);
  cardWasMoved = true;
  updateKanbanCounts();
  showToast("Статус задачи " + draggedKanbanCard.dataset.taskId + " изменён");
});

kanbanBoard?.addEventListener("dragend", () => {
  kanbanBoard.querySelectorAll(".is-dragging, .is-drag-over").forEach((item) => item.classList.remove("is-dragging", "is-drag-over"));
  draggedKanbanCard = null;
  window.setTimeout(() => {
    cardWasMoved = false;
  }, 0);
});

kanbanBoard?.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-to-column]");
  if (addButton) {
    document.getElementById("projectTaskStatus").value = addButton.dataset.addToColumn;
    bootstrap.Modal.getOrCreateInstance(document.getElementById("projectTaskModal")).show();
    return;
  }

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

document.getElementById("projectTaskForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const title = document.getElementById("projectTaskName").value.trim();
  const type = document.getElementById("projectTaskType").value;
  const status = document.getElementById("projectTaskStatus").value;
  const priority = document.getElementById("projectTaskPriority").value;
  const assignee = document.getElementById("projectTaskAssignee").value;
  const due = document.getElementById("projectTaskDue").value;
  const column = document.querySelector('[data-kanban-column="' + status + '"]');

  if (!title || !column) return;

  column.querySelector(".kanban-cards").prepend(createKanbanCard({ title, type, priority, assignee, due }));
  updateKanbanCounts();
  filterKanbanCards();
  bootstrap.Modal.getInstance(document.getElementById("projectTaskModal"))?.hide();
  bootstrap.Tab.getOrCreateInstance(document.getElementById("board-tab")).show();
  form.reset();
  showToast("Задача добавлена на доску");
});

updateKanbanCounts();

document.querySelector("[data-upload-file]")?.addEventListener("click", () => {
  showToast("Файл добавлен в проект");
});

document.getElementById("commentForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const input = document.getElementById("commentText");
  const text = input.value.trim();

  if (!text) return;

  const article = document.createElement("article");
  article.className = "discussion-item";
  const avatar = document.createElement("span");
  avatar.className = "activity-avatar avatar-lime";
  avatar.textContent = "АБ";
  const content = document.createElement("div");
  const heading = document.createElement("div");
  const author = document.createElement("strong");
  author.textContent = "Александр Бессонов";
  const time = document.createElement("small");
  time.className = "text-secondary ms-2";
  time.textContent = "Только что";
  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  heading.append(author, time);
  content.append(heading, paragraph);
  article.append(avatar, content);
  document.getElementById("discussionList").append(article);
  form.reset();
  showToast("Комментарий опубликован");
});

document.getElementById("memberSearch")?.addEventListener("input", (event) => {
  const query = event.currentTarget.value.trim().toLowerCase();
  document.querySelectorAll("#membersTable tr").forEach((row) => {
    row.classList.toggle("d-none", !row.dataset.memberName.toLowerCase().includes(query));
  });
});

document.querySelectorAll("[data-role-select]").forEach((select) => {
  select.addEventListener("change", () => showToast("Роль изменена: " + select.value));
});

document.getElementById("inviteForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const email = document.getElementById("inviteEmail").value;
  bootstrap.Modal.getInstance(document.getElementById("inviteModal"))?.hide();
  form.reset();
  showToast("Приглашение отправлено на " + email);
});
