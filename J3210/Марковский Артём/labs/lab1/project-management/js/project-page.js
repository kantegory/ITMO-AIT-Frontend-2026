function getCurrentProject() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("project") || projects[0]?.id;
  return projects.find((project) => project.id === projectId) || projects[0] || null;
}

function renderMemberList(box, members) {
  box.innerHTML = members
    .map((member) => `<span class="member-chip">${member.name} · ${member.role}</span>`)
    .join("");
}

function renderProjectBoard(boardBox, summaryBox, tasks) {
  const groups = [
    { key: "Новая", title: "Новые" },
    { key: "В работе", title: "В работе" },
    { key: "На проверке", title: "На проверке" },
    { key: "Завершено", title: "Завершено" },
  ];

  summaryBox.textContent = `${tasks.length} задач`;
  boardBox.innerHTML = groups
    .map((group) => {
      const items = tasks.filter((task) => task.status === group.key);
      const cards = items.length
        ? items
            .map(
              (task) => `
                <article class="board-task-card">
                  <div class="fw-semibold mb-2 text-wrap-anywhere">${task.title}</div>
                  <div class="card-meta text-wrap-anywhere">${task.assignee}</div>
                  <div class="card-meta">${task.priority} · ${task.due}</div>
                </article>
              `,
            )
            .join("")
        : '<div class="empty-state">Пока нет задач</div>';

      return `
        <div class="col-lg-3 col-md-6">
          <section class="board-column h-100">
            <div class="board-column-title">${group.title}</div>
            <div class="board-column-body">${cards}</div>
          </section>
        </div>
      `;
    })
    .join("");
}

function renderProjectTable(targetId, rows, renderRow) {
  const box = document.getElementById(targetId);
  if (!box) return;
  box.innerHTML = rows.map(renderRow).join("");
}

function renderProject() {
  const project = getCurrentProject();
  if (!project) {
    return;
  }

  document.getElementById("projectTitle").textContent = project.title;
  document.getElementById("projectDescription").textContent = project.description;
  document.getElementById("projectRoleBadge").textContent = project.role;
  document.getElementById("projectStatusBadge").textContent = project.status;
  document.getElementById("projectDeadline").textContent = project.deadline;
  document.getElementById("projectCurrentRoleTitle").textContent = project.role;
  document.getElementById("projectCurrentRoleText").textContent = "На этой странице можно смотреть основные данные проекта и следить за прогрессом по задачам.";
  document.getElementById("projectActionButtons").innerHTML = project.actions.length
    ? project.actions.map((action) => `<div class="soft-badge">${action.title}</div>`).join("")
    : '<div class="empty-state">Для вашей роли дополнительные действия пока не доступны.</div>';

  renderMemberList(document.getElementById("projectMembers"), project.members);
  renderProjectBoard(
    document.getElementById("projectBoard"),
    document.getElementById("projectTaskSummary"),
    project.tasks,
  );

  renderProjectTable(
    "projectDeadlines",
    project.deadlines,
    (item) => `<tr><td>${item.stage}</td><td>${item.date}</td><td>${item.owner}</td></tr>`,
  );

  renderProjectTable(
    "projectFiles",
    project.files,
    (file) => `
      <article class="list-card">
        <div class="fw-semibold mb-1 text-wrap-anywhere">${file.name}</div>
        <div class="card-meta">${file.type}</div>
        <p class="mb-0 mt-2 text-wrap-anywhere">${file.description}</p>
      </article>
    `,
  );

  renderProjectTable(
    "projectDiscussion",
    project.discussion,
    (item) => `
      <article class="note-card">
        <div class="fw-semibold mb-1">${item.author}</div>
        <div class="note-meta mb-2">${item.time}</div>
        <p class="mb-0 text-wrap-anywhere">${item.text}</p>
      </article>
    `,
  );
}
