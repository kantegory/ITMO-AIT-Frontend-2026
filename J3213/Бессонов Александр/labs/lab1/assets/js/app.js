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

document.getElementById("projectTaskForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const title = document.getElementById("projectTaskName").value.trim();
  const status = document.getElementById("projectTaskStatus").value;
  const assignee = document.getElementById("projectTaskAssignee").value;
  const column = document.querySelector('[data-kanban-column="' + status + '"]');

  if (!title || !column) return;

  const initials = assignee.split(" ").map((part) => part[0]).join("");
  const card = document.createElement("article");
  card.className = "kanban-card";
  card.innerHTML = '<small>Новая задача</small><h4></h4><div class="kanban-card-footer"><span class="activity-avatar avatar-lime"></span><span><i class="bi bi-calendar3"></i> Без срока</span></div>';
  card.querySelector("h4").textContent = title;
  card.querySelector(".activity-avatar").textContent = initials;
  column.querySelector(".kanban-cards").prepend(card);

  const counter = column.querySelector(".kanban-count");
  counter.textContent = Number(counter.textContent) + 1;
  bootstrap.Modal.getInstance(document.getElementById("projectTaskModal"))?.hide();
  bootstrap.Tab.getOrCreateInstance(document.getElementById("board-tab")).show();
  form.reset();
  showToast("Задача добавлена на доску");
});

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
