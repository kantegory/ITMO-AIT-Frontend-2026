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

  assigneeFilter.replaceChildren();

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "Все";
  assigneeFilter.append(defaultOption);

  assignees.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    assigneeFilter.append(option);
  });
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

function createSearchResultCard(task) {
  const column = document.createElement("div");
  column.className = "col-lg-6";

  const card = document.createElement("article");
  card.className = "task-card h-100";

  const badges = document.createElement("div");
  badges.className = "d-flex flex-wrap gap-2 mb-3";

  [task.status, task.priority, task.role].forEach((label) => {
    const badge = document.createElement("span");
    badge.className = "soft-badge";
    badge.textContent = label;
    badges.append(badge);
  });

  const title = document.createElement("h2");
  title.className = "task-card-title text-wrap-anywhere";
  title.title = task.title;
  title.textContent = task.title;

  const projectLine = document.createElement("p");
  projectLine.className = "card-text mb-3";
  projectLine.append("Проект: ");

  const projectLink = document.createElement("a");
  projectLink.className = "link-dark fw-semibold text-decoration-none";
  projectLink.href = `project.html?project=${task.projectId}`;
  projectLink.textContent = task.projectTitle;
  projectLine.append(projectLink);

  const assignee = document.createElement("div");
  assignee.className = "card-meta text-wrap-anywhere";
  assignee.title = `Исполнитель: ${task.assignee}`;
  assignee.textContent = `Исполнитель: ${task.assignee}`;

  const footer = document.createElement("div");
  footer.className = "task-card-footer";

  const due = document.createElement("span");
  due.className = "card-meta";
  due.textContent = `Срок: ${task.due}`;

  const link = document.createElement("a");
  link.className = "btn btn-primary";
  link.href = `project.html?project=${task.projectId}`;
  link.textContent = "Открыть проект";

  footer.append(due, link);
  card.append(badges, title, projectLine, assignee, footer);
  column.append(card);

  return column;
}

function renderSearchResults(resultBox, resultCount, tasks) {
  resultCount.textContent = `${tasks.length} результатов`;
  resultBox.replaceChildren();

  tasks.forEach((task) => {
    resultBox.append(createSearchResultCard(task));
  });
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
