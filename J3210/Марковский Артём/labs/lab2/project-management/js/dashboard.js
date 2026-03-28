function setupDashboardActions() {
  const createProjectButton = document.getElementById("createProjectButton");

  if (!createProjectButton || createProjectButton.dataset.bound) {
    return;
  }

  createProjectButton.dataset.bound = "1";
  createProjectButton.addEventListener("click", () => {
    openModal("Создать проект", buildCreateProjectModal(), true);
    bindCreateProjectModal();
  });
}

function buildCreateProjectModal() {
  return `
        <form class="modal-editor-list" id="createProjectForm">
            <div class="modal-editor-card">
                <div class="modal-section-title">Основные данные проекта</div>
                <div class="row g-3">
                    <div class="col-12">
                        <label class="form-label" for="createProjectTitle">Название</label>
                        <input class="form-control" id="createProjectTitle" type="text" maxlength="60" placeholder="Название проекта">
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="createProjectDescription">Описание</label>
                        <textarea class="form-control modal-textarea" id="createProjectDescription" maxlength="260" placeholder="Краткое описание проекта"></textarea>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="createProjectDeadline">Срок завершения</label>
                        <input class="form-control" id="createProjectDeadline" type="text" inputmode="numeric" maxlength="10" placeholder="01.01.1999">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="createProjectStatus">Статус</label>
                        <select class="form-select" id="createProjectStatus">
                            <option value="Планирование">Планирование</option>
                            <option value="Активный проект">Активный проект</option>
                            <option value="На согласовании">На согласовании</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-settings-actions">
                <button class="btn btn-primary" type="submit">Создать проект</button>
            </div>
        </form>
    `;
}

function bindCreateProjectModal() {
  const form = document.getElementById("createProjectForm");
  const deadlineField = document.getElementById("createProjectDeadline");

  if (!form || !deadlineField) {
    return;
  }

  bindDateMask(deadlineField);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const titleField = document.getElementById("createProjectTitle");
    const descriptionField = document.getElementById(
      "createProjectDescription",
    );
    const statusField = document.getElementById("createProjectStatus");

    const title = titleField.value.trim();
    const description = descriptionField.value.trim();
    const deadline = normalizeDateInput(deadlineField.value);

    titleField.setCustomValidity(title ? "" : "Укажите название проекта");
    deadlineField.setCustomValidity(
      isValidDateString(deadline) ? "" : "Дата в формате ДД.ММ.ГГГГ",
    );

    if (!title || !isValidDateString(deadline)) {
      form.reportValidity();
      return;
    }

    const projectId = `project-${Date.now()}`;
    const currentUser = getUserName();

    const project = {
      id: projectId,
      title: title.slice(0, 60),
      description: (
        description || "Новый проект без описания."
      ).slice(0, 260),
      status: statusField.value,
      deadline,
      members: [{ name: currentUser, role: "Администратор" }],
      tasks: [],
      deadlines: [
        { stage: "Старт проекта", date: deadline, owner: currentUser },
      ],
      files: [],
      discussion: [],
    };

    const nextProjects = [
      applyProjectView(project, currentUser),
      ...projects.filter((item) => item.id !== project.id),
    ];

    setProjects(nextProjects);
    void createProjectInApi(project).catch((error) => console.error(error));
    window.location.href = `project.html?project=${projectId}`;
  });
}

function getDashboardTasks() {
  return projects.flatMap((project) =>
    project.tasks.map((task) => ({
      ...task,
      projectTitle: project.title,
      projectId: project.id,
      role: project.role,
    })),
  );
}

function getDashboardNotes() {
  return projects.flatMap((project) =>
    project.discussion.slice(0, 1).map((item) => ({
      ...item,
      projectTitle: project.title,
      projectId: project.id,
    })),
  );
}

function renderDashboardSummary(summaryBox, tasks) {
  const roleSummary = {
    admin: projects.filter((project) => project.role === "Администратор").length,
    member: projects.filter((project) => project.role === "Участник").length,
    watcher: projects.filter((project) => project.role === "Наблюдатель").length,
  };

  const summaryRows = [
    ["Проектов", projects.length],
    ["Активных задач", tasks.length],
    ["Администратор", roleSummary.admin],
    ["Участник", roleSummary.member],
    ["Наблюдатель", roleSummary.watcher],
  ];

  summaryBox.replaceChildren();

  summaryRows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "stats-line";

    const name = document.createElement("span");
    name.textContent = label;

    const count = document.createElement("strong");
    count.textContent = String(value);

    row.append(name, count);
    summaryBox.append(row);
  });
}

function createDashboardProjectCard(project) {
  const column = document.createElement("div");
  column.className = "col-lg-4 col-md-6";

  const card = document.createElement("article");
  card.className = "project-card h-100";

  const badges = document.createElement("div");
  badges.className = "d-flex flex-wrap gap-2 mb-3";

  const roleBadge = document.createElement("span");
  roleBadge.className = "soft-badge";
  roleBadge.textContent = project.role;

  const statusBadge = document.createElement("span");
  statusBadge.className = "status-badge";
  statusBadge.textContent = project.status;

  badges.append(roleBadge, statusBadge);

  const title = document.createElement("h2");
  title.className = "project-card-title mb-2 text-wrap-anywhere";
  title.title = project.title;
  title.textContent = project.title;

  const description = document.createElement("p");
  description.className = "card-text mb-3 text-wrap-anywhere";
  description.textContent = project.description;

  const deadline = document.createElement("div");
  deadline.className = "card-meta";
  deadline.textContent = `Срок завершения: ${project.deadline}`;

  const footer = document.createElement("div");
  footer.className = "project-card-footer";

  const members = document.createElement("span");
  members.className = "card-meta";
  members.textContent = `${project.members.length} участника`;

  const link = document.createElement("a");
  link.className = "btn btn-primary";
  link.href = `project.html?project=${project.id}`;
  link.textContent = "Открыть проект";

  footer.append(members, link);
  card.append(badges, title, description, deadline, footer);
  column.append(card);

  return column;
}

function renderDashboardProjects(projectsBox) {
  projectsBox.replaceChildren();

  if (!projects.length) {
    const empty = document.createElement("div");
    empty.className = "empty-pane";
    empty.textContent = "У вас пока нет проектов.";
    projectsBox.append(empty);
    return;
  }

  projects.forEach((project) => {
    projectsBox.append(createDashboardProjectCard(project));
  });
}

function createDashboardTaskRow(task) {
  const row = document.createElement("article");
  row.className = "task-row";

  const info = document.createElement("div");

  const title = document.createElement("div");
  title.className = "fw-bold mb-1 clamp-2";
  title.title = task.title;
  title.textContent = task.title;

  const project = document.createElement("div");
  project.className = "task-row-meta text-wrap-anywhere";
  project.title = task.projectTitle;
  project.textContent = task.projectTitle;

  const meta = document.createElement("div");
  meta.className = "task-row-meta text-wrap-anywhere";
  meta.title = `${task.assignee} · ${task.due}`;
  meta.textContent = `${task.assignee} · ${task.due}`;

  info.append(title, project, meta);

  const link = document.createElement("a");
  link.className = "btn btn-light";
  link.href = `project.html?project=${task.projectId}`;
  link.textContent = "Открыть";

  row.append(info, link);
  return row;
}

function renderDashboardTasks(tasksBox, countBadge, tasks) {
  const currentTasks = tasks.slice(0, 4);

  countBadge.textContent = `${tasks.length} задач`;
  tasksBox.replaceChildren();

  if (!currentTasks.length) {
    const empty = document.createElement("div");
    empty.className = "empty-pane";
    empty.textContent = "Сейчас активных задач нет.";
    tasksBox.append(empty);
    return;
  }

  currentTasks.forEach((task) => {
    tasksBox.append(createDashboardTaskRow(task));
  });
}

function createDashboardNotification(item) {
  const card = document.createElement("article");
  card.className = "note-card";

  const project = document.createElement("div");
  project.className = "fw-bold mb-1";
  project.textContent = item.projectTitle;

  const meta = document.createElement("div");
  meta.className = "note-meta mb-2";
  meta.textContent = `${item.author} · ${item.time}`;

  const text = document.createElement("p");
  text.className = "mb-3";
  text.textContent = item.text;

  const link = document.createElement("a");
  link.className = "btn btn-light btn-sm";
  link.href = `project.html?project=${item.projectId}`;
  link.textContent = "Перейти к проекту";

  card.append(project, meta, text, link);
  return card;
}

function renderDashboardNotifications(notificationsBox, notes) {
  notificationsBox.replaceChildren();

  if (!notes.length) {
    const empty = document.createElement("div");
    empty.className = "empty-pane";
    empty.textContent = "Пока нет новых сообщений.";
    notificationsBox.append(empty);
    return;
  }

  notes.forEach((item) => {
    notificationsBox.append(createDashboardNotification(item));
  });
}

function renderDashboardError(projectsBox, tasksBox, notificationsBox, summaryBox, countBadge) {
  summaryBox.replaceChildren();
  countBadge.textContent = "0 задач";

  [projectsBox, tasksBox, notificationsBox].forEach((box) => {
    box.replaceChildren();
    const empty = document.createElement("div");
    empty.className = "empty-pane";
    empty.textContent = "Не получилось загрузить данные. Попробуйте обновить страницу.";
    box.append(empty);
  });
}

async function renderDashboard() {
  const projectsBox = document.getElementById("dashboardProjects");
  const tasksBox = document.getElementById("dashboardTasks");
  const notificationsBox = document.getElementById("dashboardNotifications");
  const summaryBox = document.getElementById("workspaceSummaryCard");
  const countBadge = document.getElementById("taskCountBadge");

  if (
    !projectsBox ||
    !tasksBox ||
    !notificationsBox ||
    !summaryBox ||
    !countBadge
  ) {
    return;
  }

  try {
    await refreshProjects({ silent: false });
  } catch {
    renderDashboardError(projectsBox, tasksBox, notificationsBox, summaryBox, countBadge);
    return;
  }

  const tasks = getDashboardTasks();
  const notes = getDashboardNotes();

  renderDashboardSummary(summaryBox, tasks);
  renderDashboardProjects(projectsBox);
  renderDashboardTasks(tasksBox, countBadge, tasks);
  renderDashboardNotifications(notificationsBox, notes);
}
