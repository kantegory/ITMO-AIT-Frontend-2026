function getSearchTasks() {
  return projects.flatMap((project) =>
    project.tasks.map((task) => ({
      ...task,
      projectTitle: project.title,
      projectId: project.id,
      role: project.role,
    })),
  );
}

function fillAssigneeFilter(assigneeFilter, tasks) {
  const assignees = [...new Set(tasks.map((task) => task.assignee))].sort(
    (left, right) => left.localeCompare(right, "ru"),
  );

  assigneeFilter.innerHTML =
    '<option value="all">Все</option>' +
    assignees
      .map((name) => `<option value="${name}">${name}</option>`)
      .join("");
}

function filterTasks(tasks, filters) {
  return tasks.filter((task) => {
    const matchesQuery =
      !filters.query ||
      `${task.title} ${task.projectTitle}`
        .toLowerCase()
        .includes(filters.query);
    const matchesStatus =
      filters.statusValue === "all" || task.status === filters.statusValue;
    const matchesPriority =
      filters.priorityValue === "all" || task.priority === filters.priorityValue;
    const matchesAssignee =
      filters.assigneeValue === "all" || task.assignee === filters.assigneeValue;

    return (
      matchesQuery && matchesStatus && matchesPriority && matchesAssignee
    );
  });
}

function renderSearchResults(resultBox, resultCount, tasks) {
  resultCount.textContent = `${tasks.length} результатов`;
  resultBox.innerHTML = tasks
    .map(
      (task) => `
            <div class="col-lg-6">
                <article class="task-card h-100">
                    <div class="d-flex flex-wrap gap-2 mb-3">
                        <span class="soft-badge">${task.status}</span>
                        <span class="soft-badge">${task.priority}</span>
                        <span class="soft-badge">${task.role}</span>
                    </div>
                    <h2 class="task-card-title text-wrap-anywhere" title="${task.title}">${task.title}</h2>
                    <p class="card-text mb-3">Проект: <a class="link-dark fw-semibold text-decoration-none" href="project.html?project=${task.projectId}">${task.projectTitle}</a></p>
                    <div class="card-meta text-wrap-anywhere" title="Исполнитель: ${task.assignee}">Исполнитель: ${task.assignee}</div>
                    <div class="task-card-footer">
                        <span class="card-meta">Срок: ${task.due}</span>
                        <a class="btn btn-primary" href="project.html?project=${task.projectId}">Открыть проект</a>
                    </div>
                </article>
            </div>
        `,
    )
    .join("");
}

function renderSearch() {
  const searchQuery = document.getElementById("searchQuery");
  const statusFilter = document.getElementById("statusFilter");
  const priorityFilter = document.getElementById("priorityFilter");
  const assigneeFilter = document.getElementById("assigneeFilter");
  const applyButton = document.getElementById("applySearchButton");
  const resultCount = document.getElementById("searchResultCount");
  const resultBox = document.getElementById("searchResults");

  if (
    !searchQuery ||
    !statusFilter ||
    !priorityFilter ||
    !assigneeFilter ||
    !applyButton ||
    !resultCount ||
    !resultBox
  ) {
    return;
  }

  syncProjects();

  const allTasks = getSearchTasks();
  fillAssigneeFilter(assigneeFilter, allTasks);

  const applySearch = () => {
    const filtered = filterTasks(allTasks, {
      query: searchQuery.value.trim().toLowerCase(),
      statusValue: statusFilter.value,
      priorityValue: priorityFilter.value,
      assigneeValue: assigneeFilter.value,
    });

    renderSearchResults(resultBox, resultCount, filtered);
  };

  applyButton.addEventListener("click", applySearch);
  searchQuery.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applySearch();
    }
  });

  applySearch();
}
