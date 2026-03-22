function setupDashboardActions() {
  const createProjectButton = document.getElementById("createProjectButton");

  if (!createProjectButton) {
    return;
  }

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

    projects.unshift({
      id: projectId,
      title: title.slice(0, 60),
      description: (
        description || "Новый проект без описания."
      ).slice(0, 260),
      role: "Администратор",
      status: statusField.value,
      deadline,
      members: [{ name: currentUser, role: "Администратор" }],
      actions: buildProjectActions("Администратор"),
      tasks: [],
      deadlines: [
        { stage: "Старт проекта", date: deadline, owner: currentUser },
      ],
      files: [],
      discussion: [],
    });

    saveProjects();
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

  summaryBox.innerHTML = `
        <div class="stats-line">
            <span>Проектов</span>
            <strong>${projects.length}</strong>
        </div>
        <div class="stats-line">
            <span>Активных задач</span>
            <strong>${tasks.length}</strong>
        </div>
        <div class="stats-line">
            <span>Администратор</span>
            <strong>${roleSummary.admin}</strong>
        </div>
        <div class="stats-line">
            <span>Участник</span>
            <strong>${roleSummary.member}</strong>
        </div>
        <div class="stats-line">
            <span>Наблюдатель</span>
            <strong>${roleSummary.watcher}</strong>
        </div>
    `;
}

function renderDashboardProjects(projectsBox) {
  projectsBox.innerHTML = projects
    .map(
      (project) => `
        <div class="col-lg-4 col-md-6">
            <article class="project-card h-100">
                <div class="d-flex flex-wrap gap-2 mb-3">
                    <span class="soft-badge">${project.role}</span>
                    <span class="status-badge">${project.status}</span>
                </div>
                <h2 class="project-card-title mb-2 text-wrap-anywhere" title="${project.title}">${project.title}</h2>
                <p class="card-text mb-3 text-wrap-anywhere">${project.description}</p>
                <div class="card-meta">Срок завершения: ${project.deadline}</div>
                <div class="project-card-footer">
                    <span class="card-meta">${project.members.length} участника</span>
                    <a class="btn btn-primary" href="project.html?project=${project.id}">Открыть проект</a>
                </div>
            </article>
        </div>
    `,
    )
    .join("");
}

function renderDashboardTasks(tasksBox, countBadge, tasks) {
  const currentTasks = tasks.slice(0, 4);

  countBadge.textContent = `${tasks.length} задач`;
  tasksBox.innerHTML = currentTasks
    .map(
      (task) => `
        <article class="task-row">
            <div>
                <div class="fw-bold mb-1 clamp-2" title="${task.title}">${task.title}</div>
                <div class="task-row-meta text-wrap-anywhere" title="${task.projectTitle}">${task.projectTitle}</div>
                <div class="task-row-meta text-wrap-anywhere" title="${task.assignee} · ${task.due}">${task.assignee} · ${task.due}</div>
            </div>
            <a class="btn btn-light" href="project.html?project=${task.projectId}">Открыть</a>
        </article>
    `,
    )
    .join("");
}

function renderDashboardNotifications(notificationsBox, notes) {
  notificationsBox.innerHTML = notes
    .map(
      (item) => `
        <article class="note-card">
            <div class="fw-bold mb-1">${item.projectTitle}</div>
            <div class="note-meta mb-2">${item.author} · ${item.time}</div>
            <p class="mb-3">${item.text}</p>
            <a class="btn btn-light btn-sm" href="project.html?project=${item.projectId}">Перейти к проекту</a>
        </article>
    `,
    )
    .join("");
}

function renderDashboard() {
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

  syncProjects();

  const tasks = getDashboardTasks();
  const notes = getDashboardNotes();

  renderDashboardSummary(summaryBox, tasks);
  renderDashboardProjects(projectsBox);
  renderDashboardTasks(tasksBox, countBadge, tasks);
  renderDashboardNotifications(notificationsBox, notes);
}
