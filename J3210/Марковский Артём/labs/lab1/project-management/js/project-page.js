function buildTeamModal(project) {
  return `
        <div class="modal-editor-list">
            <div class="modal-editor-card">
                <div class="modal-section-title">Состав команды</div>
                ${project.members
                  .map(
                    (member, index) => `
                    <div class="modal-grid modal-grid-team">
                        <input class="form-control" type="text" value="${member.name}" data-member-name="${index}">
                        <select class="form-select" data-member-role="${index}">
                            <option value="Администратор" ${member.role === "Администратор" ? "selected" : ""}>Администратор</option>
                            <option value="Участник" ${member.role === "Участник" ? "selected" : ""}>Участник</option>
                            <option value="Наблюдатель" ${member.role === "Наблюдатель" ? "selected" : ""}>Наблюдатель</option>
                        </select>
                        <button class="btn btn-light" type="button" data-remove-member="${index}">Удалить</button>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            <div class="modal-editor-card">
                <div class="modal-section-title">Добавить участника</div>
                <div class="modal-grid modal-grid-team-add">
                    <input class="form-control" id="newMemberName" type="text" placeholder="Имя и фамилия">
                    <select class="form-select" id="newMemberRole">
                        <option value="Участник">Участник</option>
                        <option value="Наблюдатель">Наблюдатель</option>
                        <option value="Администратор">Администратор</option>
                    </select>
                    <button class="btn btn-primary" type="button" id="addMemberButton">Добавить</button>
                </div>
            </div>
        </div>
    `;
}

function bindTeamModal(projectId) {
  const modalBody = document.getElementById("detailsModalBody");

  modalBody.querySelectorAll("[data-member-name]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const memberIndex = Number(event.currentTarget.dataset.memberName);
      const value = event.currentTarget.value.trim();

      if (!value) {
        return;
      }

      updateProject(projectId, (project) => {
        const previousName = project.members[memberIndex].name;
        const nextName = value.slice(0, 60);
        project.members[memberIndex].name = nextName;

        project.tasks.forEach((task) => {
          if (task.assignee === previousName) {
            task.assignee = nextName;
          }
        });

        if (previousName === getUserName()) {
          sessionStorage.setItem(storageKeys.userName, nextName);
        }
      });

      setUserName();
      rerenderCurrentPage();
    });
  });

  modalBody.querySelectorAll("[data-member-role]").forEach((select) => {
    select.addEventListener("change", (event) => {
      const memberIndex = Number(event.currentTarget.dataset.memberRole);
      const value = event.currentTarget.value;

      updateProject(projectId, (project) => {
        project.members[memberIndex].role = value;

        if (project.members[memberIndex].name === getUserName()) {
          project.role = value;
          project.actions = buildProjectActions(value);
        }
      });

      rerenderCurrentPage();
    });
  });

  modalBody.querySelectorAll("[data-remove-member]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const memberIndex = Number(event.currentTarget.dataset.removeMember);

      updateProject(projectId, (project) => {
        const removedMember = project.members[memberIndex];

        if (!removedMember) {
          return;
        }

        project.tasks.forEach((task) => {
          if (task.assignee === removedMember.name) {
            task.assignee = "Без исполнителя";

            if (task.status === "Завершено") {
              task.status = "Новая";
            }
          }
        });

        project.members.splice(memberIndex, 1);
      });

      rerenderCurrentPage();
      openActionModal(projectId, "team");
    });
  });

  const addButton = document.getElementById("addMemberButton");

  if (!addButton) {
    return;
  }

  addButton.addEventListener("click", () => {
    const nameField = document.getElementById("newMemberName");
    const roleField = document.getElementById("newMemberRole");
    const name = nameField.value.trim();

    if (!name) {
      nameField.focus();
      return;
    }

    updateProject(projectId, (project) => {
      project.members.push({
        name: name.slice(0, 60),
        role: roleField.value,
      });
    });

    rerenderCurrentPage();
    openActionModal(projectId, "team");
  });
}

function buildTasksModal(project) {
  const memberNames = [
    "Без исполнителя",
    ...project.members.map((member) => member.name),
  ].filter((name, index, list) => list.indexOf(name) === index);

  const buildOptions = (selectedValue) =>
    memberNames
      .map(
        (name) =>
          `<option value="${name}" ${selectedValue === name ? "selected" : ""}>${name}</option>`,
      )
      .join("");

  if (project.role === "Участник") {
    const currentUser = getUserName();

    return `
            <div class="modal-editor-list">
                <div class="modal-editor-card">
                    <div class="modal-section-title">Мои задачи и свободные карточки</div>
                    <div class="modal-caption mb-3">Участник может взять свободную задачу и менять статус только у своих карточек.</div>
                    ${project.tasks
                      .map((task, index) => {
                        const isOwnTask = task.assignee === currentUser;
                        const isFreeTask = task.assignee === "Без исполнителя";

                        return `
                            <div class="modal-task-card">
                                <div class="modal-grid modal-grid-member-task">
                                    <div class="modal-task-summary">
                                        <div class="fw-bold text-wrap-anywhere">${task.title}</div>
                                        <div class="modal-caption text-wrap-anywhere">${task.assignee} · ${task.priority} приоритет · ${task.due}</div>
                                    </div>
                                    <select class="form-select" data-task-status="${index}" ${isOwnTask ? "" : "disabled"}>
                                        <option value="Новая" ${task.status === "Новая" ? "selected" : ""}>Новая</option>
                                        <option value="В работе" ${task.status === "В работе" ? "selected" : ""}>В работе</option>
                                        <option value="На проверке" ${task.status === "На проверке" ? "selected" : ""}>На проверке</option>
                                        <option value="Завершено" ${task.status === "Завершено" ? "selected" : ""}>Завершено</option>
                                    </select>
                                    <button class="btn btn-primary" type="button" data-take-task="${index}" ${isFreeTask ? "" : "disabled"}>Взять задачу</button>
                                </div>
                            </div>
                        `;
                      })
                      .join("")}
                </div>
            </div>
        `;
  }

  return `
        <div class="modal-editor-list">
            <div class="modal-editor-card">
                <div class="modal-section-title">Карточки задач</div>
                ${project.tasks
                  .map(
                    (task, index) => `
                    <div class="modal-task-card">
                        <div class="modal-grid modal-grid-tasks">
                            <input class="form-control" type="text" maxlength="80" value="${task.title}" data-task-title="${index}">
                            <select class="form-select" data-task-status="${index}">
                                <option value="Новая" ${task.status === "Новая" ? "selected" : ""}>Новая</option>
                                <option value="В работе" ${task.status === "В работе" ? "selected" : ""}>В работе</option>
                                <option value="На проверке" ${task.status === "На проверке" ? "selected" : ""}>На проверке</option>
                                <option value="Завершено" ${task.status === "Завершено" ? "selected" : ""}>Завершено</option>
                            </select>
                            <select class="form-select" data-task-priority="${index}">
                                <option value="Высокий" ${task.priority === "Высокий" ? "selected" : ""}>Высокий</option>
                                <option value="Средний" ${task.priority === "Средний" ? "selected" : ""}>Средний</option>
                                <option value="Низкий" ${task.priority === "Низкий" ? "selected" : ""}>Низкий</option>
                            </select>
                            <select class="form-select" data-task-assignee="${index}">
                                ${buildOptions(task.assignee)}
                            </select>
                            <input class="form-control" type="text" inputmode="numeric" maxlength="10" value="${task.due}" data-task-due="${index}">
                            <button class="btn btn-light" type="button" data-remove-task="${index}">Удалить</button>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            <div class="modal-editor-card">
                <div class="modal-section-title">Добавить задачу</div>
                <div class="modal-grid modal-grid-tasks-add">
                    <input class="form-control" id="newTaskTitle" type="text" maxlength="80" placeholder="Название задачи">
                    <select class="form-select" id="newTaskAssignee">
                        ${buildOptions("Без исполнителя")}
                    </select>
                    <input class="form-control" id="newTaskDue" type="text" inputmode="numeric" maxlength="10" placeholder="01.01.1999">
                    <select class="form-select" id="newTaskPriority">
                        <option value="Высокий">Высокий</option>
                        <option value="Средний">Средний</option>
                        <option value="Низкий">Низкий</option>
                    </select>
                    <button class="btn btn-primary" type="button" id="addTaskButton">Добавить задачу</button>
                </div>
            </div>
        </div>
    `;
}

function bindTasksModal(projectId) {
  const modalBody = document.getElementById("detailsModalBody");

  modalBody.querySelectorAll("[data-task-title]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const taskIndex = Number(event.currentTarget.dataset.taskTitle);
      const value = event.currentTarget.value.trim();

      if (!value) {
        return;
      }

      updateProject(projectId, (project) => {
        if (project.tasks[taskIndex]) {
          project.tasks[taskIndex].title = value.slice(0, 80);
        }
      });

      rerenderCurrentPage();
    });
  });

  modalBody.querySelectorAll("[data-task-status]").forEach((select) => {
    select.addEventListener("change", (event) => {
      const taskIndex = Number(event.currentTarget.dataset.taskStatus);

      updateProject(projectId, (project) => {
        const task = project.tasks[taskIndex];

        if (!task) {
          return;
        }

        if (project.role === "Участник" && task.assignee !== getUserName()) {
          return;
        }

        task.status = event.currentTarget.value;
      });

      rerenderCurrentPage();
      openActionModal(projectId, "tasks");
    });
  });

  modalBody.querySelectorAll("[data-task-priority]").forEach((select) => {
    select.addEventListener("change", (event) => {
      const taskIndex = Number(event.currentTarget.dataset.taskPriority);

      updateProject(projectId, (project) => {
        if (project.tasks[taskIndex]) {
          project.tasks[taskIndex].priority = event.currentTarget.value;
        }
      });

      rerenderCurrentPage();
    });
  });

  modalBody.querySelectorAll("[data-task-assignee]").forEach((select) => {
    select.addEventListener("change", (event) => {
      const taskIndex = Number(event.currentTarget.dataset.taskAssignee);

      updateProject(projectId, (project) => {
        if (project.tasks[taskIndex]) {
          project.tasks[taskIndex].assignee = event.currentTarget.value;
        }
      });

      rerenderCurrentPage();
    });
  });

  modalBody.querySelectorAll("[data-task-due]").forEach((input) => {
    bindDateMask(input);

    input.addEventListener("change", (event) => {
      const taskIndex = Number(event.currentTarget.dataset.taskDue);
      const value = normalizeDateInput(event.currentTarget.value);

      event.currentTarget.value = value;
      event.currentTarget.setCustomValidity(
        isValidDateString(value) ? "" : "Дата в формате ДД.ММ.ГГГГ",
      );

      if (!isValidDateString(value)) {
        event.currentTarget.reportValidity();
        return;
      }

      updateProject(projectId, (project) => {
        if (project.tasks[taskIndex]) {
          project.tasks[taskIndex].due = value;
        }
      });

      rerenderCurrentPage();
    });
  });

  modalBody.querySelectorAll("[data-remove-task]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const taskIndex = Number(event.currentTarget.dataset.removeTask);

      updateProject(projectId, (project) => {
        project.tasks.splice(taskIndex, 1);
      });

      rerenderCurrentPage();
      openActionModal(projectId, "tasks");
    });
  });

  modalBody.querySelectorAll("[data-take-task]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const taskIndex = Number(event.currentTarget.dataset.takeTask);

      updateProject(projectId, (project) => {
        const task = project.tasks[taskIndex];

        if (!task || task.assignee !== "Без исполнителя") {
          return;
        }

        task.assignee = getUserName();

        if (task.status === "Новая") {
          task.status = "В работе";
        }
      });

      rerenderCurrentPage();
      openActionModal(projectId, "tasks");
    });
  });

  const addButton = document.getElementById("addTaskButton");
  const newTaskDueField = document.getElementById("newTaskDue");

  bindDateMask(newTaskDueField);

  if (!addButton) {
    return;
  }

  addButton.addEventListener("click", () => {
    const titleField = document.getElementById("newTaskTitle");
    const assigneeField = document.getElementById("newTaskAssignee");
    const dueField = document.getElementById("newTaskDue");
    const priorityField = document.getElementById("newTaskPriority");

    const title = titleField.value.trim();
    const assignee = assigneeField.value;
    const due = normalizeDateInput(dueField.value);

    titleField.setCustomValidity(title ? "" : "Укажите название задачи");
    dueField.setCustomValidity(
      isValidDateString(due) ? "" : "Дата в формате ДД.ММ.ГГГГ",
    );

    if (!title || !isValidDateString(due)) {
      if (!title) {
        titleField.reportValidity();
        titleField.focus();
      } else {
        dueField.reportValidity();
        dueField.focus();
      }

      return;
    }

    updateProject(projectId, (project) => {
      project.tasks.push({
        title: title.slice(0, 80),
        status: "Новая",
        priority: priorityField.value,
        assignee,
        due,
      });
    });

    rerenderCurrentPage();
    openActionModal(projectId, "tasks");
  });
}

function buildSettingsModal(project) {
  return `
        <form class="modal-editor-list" id="projectSettingsForm">
            <div class="modal-editor-card">
                <div class="modal-section-title">Основные параметры проекта</div>
                <div class="row g-3">
                    <div class="col-12">
                        <label class="form-label" for="settingsTitle">Название</label>
                        <input class="form-control" id="settingsTitle" type="text" maxlength="60" value="${project.title}">
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="settingsDescription">Описание</label>
                        <textarea class="form-control modal-textarea" id="settingsDescription" maxlength="260">${project.description}</textarea>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="settingsStatus">Статус</label>
                        <select class="form-select" id="settingsStatus">
                            <option value="Активный проект" ${project.status === "Активный проект" ? "selected" : ""}>Активный проект</option>
                            <option value="Планирование" ${project.status === "Планирование" ? "selected" : ""}>Планирование</option>
                            <option value="На согласовании" ${project.status === "На согласовании" ? "selected" : ""}>На согласовании</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="settingsDeadline">Срок завершения</label>
                        <input class="form-control" id="settingsDeadline" type="text" inputmode="numeric" maxlength="10" value="${project.deadline}">
                    </div>
                </div>
            </div>
            <div class="modal-settings-actions">
                <button class="btn btn-primary" type="submit">Сохранить изменения</button>
                <button class="btn btn-light modal-danger-button" type="button" id="deleteProjectButton">Удалить проект</button>
            </div>
        </form>
    `;
}

function bindSettingsModal(projectId) {
  const form = document.getElementById("projectSettingsForm");
  const deleteButton = document.getElementById("deleteProjectButton");

  if (!form) {
    return;
  }

  const deadlineField = document.getElementById("settingsDeadline");

  bindDateMask(deadlineField);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nextDeadline = normalizeDateInput(
      document.getElementById("settingsDeadline").value.trim(),
    );

    deadlineField.setCustomValidity(
      isValidDateString(nextDeadline) ? "" : "Дата в формате ДД.ММ.ГГГГ",
    );

    if (!isValidDateString(nextDeadline)) {
      deadlineField.reportValidity();
      return;
    }

    updateProject(projectId, (project) => {
      project.title =
        document.getElementById("settingsTitle").value.trim().slice(0, 60) ||
        project.title;
      project.description =
        document
          .getElementById("settingsDescription")
          .value.trim()
          .slice(0, 260) || project.description;
      project.status = document.getElementById("settingsStatus").value;
      project.deadline = nextDeadline;
    });

    rerenderCurrentPage();
    openActionModal(projectId, "settings");
  });

  if (!deleteButton) {
    return;
  }

  deleteButton.addEventListener("click", () => {
    projects = projects.filter((project) => project.id !== projectId);

    if (!projects.length) {
      projects = cloneData(initialProjects);
    }

    saveProjects();

    const { modalElement } = getModalElements();

    if (modalElement) {
      bootstrap.Modal.getOrCreateInstance(modalElement).hide();
    }

    window.location.href = "dashboard.html";
  });
}

function buildDiscussionModal(project) {
  return `
        <div class="modal-editor-list">
            <div class="modal-editor-card">
                <div class="modal-section-title">Новое сообщение</div>
                <div class="modal-caption mb-3">Сообщение добавляется в обсуждение выбранного проекта и сразу отображается на странице.</div>
                <textarea class="form-control modal-textarea" id="newDiscussionText" placeholder="Напишите сообщение для команды"></textarea>
                <div class="d-grid mt-3">
                    <button class="btn btn-primary" type="button" id="addDiscussionButton">Добавить сообщение</button>
                </div>
            </div>
            <div class="modal-editor-card">
                <div class="modal-section-title">Последние сообщения</div>
                <div class="stack-list">
                    ${project.discussion
                      .map(
                        (item) => `
                        <article class="discussion-card">
                            <div class="fw-bold text-wrap-anywhere" title="${item.author}">${item.author}</div>
                            <div class="note-meta mb-2">${item.time}</div>
                            <p class="mb-0 text-wrap-anywhere">${item.text}</p>
                        </article>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `;
}

function bindDiscussionModal(projectId) {
  const addButton = document.getElementById("addDiscussionButton");

  if (!addButton) {
    return;
  }

  addButton.addEventListener("click", () => {
    const textField = document.getElementById("newDiscussionText");
    const text = textField.value.trim();

    if (!text) {
      textField.focus();
      return;
    }

    updateProject(projectId, (project) => {
      project.discussion.unshift({
        author: getUserName(),
        time: "Только что",
        text,
      });
    });

    rerenderCurrentPage();
    openActionModal(projectId, "discussion");
  });
}

function openActionModal(projectId, actionType) {
  syncProjects();
  const project = getProject(projectId);

  if (actionType === "team") {
    openModal("Команда", buildTeamModal(project), true);
    bindTeamModal(projectId);
    return;
  }

  if (actionType === "tasks") {
    openModal("Задачи", buildTasksModal(project), true);
    bindTasksModal(projectId);
    return;
  }

  if (actionType === "settings") {
    openModal("Настройки", buildSettingsModal(project), true);
    bindSettingsModal(projectId);
    return;
  }

  if (actionType === "discussion") {
    openModal("Обсуждение", buildDiscussionModal(project), true);
    bindDiscussionModal(projectId);
  }
}

function renderProjectMembers(membersBox, members) {
  membersBox.innerHTML = members
    .map(
      (member) => `
        <div class="member-item">
            <div class="text-wrap-anywhere" title="${member.name}">${member.name}</div>
            <div class="member-role">${member.role}</div>
        </div>
    `,
    )
    .join("");
}

function renderProjectActions(actionButtons, project) {
  if (project.actions.length) {
    actionButtons.innerHTML = project.actions
      .map(
        (action, index) => `
            <button class="action-button" type="button" title="${action.title}" data-action-index="${index}">
                ${action.title}
                <span>${action.text}</span>
            </button>
        `,
      )
      .join("");

    return;
  }

  actionButtons.innerHTML =
    '<div class="action-empty">Для роли наблюдателя доступны просмотр задач, сроков, файлов и обсуждений проекта.</div>';
}

function renderProjectBoard(board, project) {
  const statuses = ["Новая", "В работе", "На проверке", "Завершено"];

  board.innerHTML = statuses
    .map((status) => {
      const tasks = project.tasks
        .map((task, index) => ({ ...task, index }))
        .filter((task) => task.status === status);

      return `
            <div class="col-lg-3 col-md-6">
                <div class="board-column">
                    <div class="board-column-title">${status}</div>
                    <div class="board-list">
                        ${
                          tasks.length
                            ? tasks
                                .map(
                                  (task) => `
                            <button class="board-task" type="button" data-task-index="${task.index}">
                                <div class="fw-bold mb-2 text-wrap-anywhere" title="${task.title}">${task.title}</div>
                                <div class="card-meta text-wrap-anywhere" title="${task.assignee}">${task.assignee}</div>
                                <div class="card-meta text-wrap-anywhere" title="${task.priority} приоритет · ${task.due}">${task.priority} приоритет · ${task.due}</div>
                            </button>
                        `,
                                )
                                .join("")
                            : '<div class="card-meta">Нет задач</div>'
                        }
                    </div>
                </div>
            </div>
        `;
    })
    .join("");
}

function renderProjectDeadlines(deadlinesBox, deadlines) {
  deadlinesBox.innerHTML = deadlines.length
    ? deadlines
        .map(
          (item) => `
        <tr>
            <td>${item.stage}</td>
            <td>${item.date}</td>
            <td>${item.owner}</td>
        </tr>
    `,
        )
        .join("")
    : '<tr><td colspan="3" class="table-empty">Сроки пока не добавлены.</td></tr>';
}

function renderProjectFiles(filesBox, project) {
  filesBox.innerHTML = project.files.length
    ? project.files
        .map(
          (file, index) => `
        <button class="file-card" type="button" data-file-index="${index}">
            <div class="file-card-line">
                <div>
                    <div class="fw-bold mb-1 text-wrap-anywhere" title="${file.name}">${file.name}</div>
                    <div class="file-meta text-wrap-anywhere">${file.description}</div>
                </div>
                <span class="soft-badge">${file.type}</span>
            </div>
        </button>
    `,
        )
        .join("")
    : '<div class="empty-pane">Файлы пока не добавлены.</div>';
}

function renderProjectDiscussion(discussionBox, discussion) {
  discussionBox.innerHTML = discussion.length
    ? discussion
        .map(
          (item) => `
        <article class="discussion-card">
            <div class="fw-bold text-wrap-anywhere" title="${item.author}">${item.author}</div>
            <div class="note-meta mb-2">${item.time}</div>
            <p class="mb-0 text-wrap-anywhere">${item.text}</p>
        </article>
    `,
        )
        .join("")
    : '<div class="empty-pane">Обсуждения пока пустые.</div>';
}

function bindProjectActionButtons(project) {
  document.querySelectorAll("[data-action-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = project.actions[Number(button.dataset.actionIndex)];

      if (!action) {
        return;
      }

      document
        .querySelectorAll(".action-button")
        .forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      openActionModal(project.id, action.type);
    });
  });
}

function bindProjectTaskCards(project) {
  document.querySelectorAll("[data-task-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = project.tasks[Number(button.dataset.taskIndex)];

      if (!task) {
        return;
      }

      showDetails(
        task.title,
        `
                <div class="stack-list">
                    <div><span class="card-meta">Статус:</span> ${task.status}</div>
                    <div><span class="card-meta">Приоритет:</span> ${task.priority}</div>
                    <div><span class="card-meta">Исполнитель:</span> ${task.assignee}</div>
                    <div><span class="card-meta">Срок:</span> ${task.due}</div>
                </div>
            `,
      );
    });
  });
}

function bindProjectFiles(project) {
  document.querySelectorAll("[data-file-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const file = project.files[Number(button.dataset.fileIndex)];

      if (!file) {
        return;
      }

      showDetails(
        file.name,
        `
                <div class="stack-list">
                    <div><span class="card-meta">Тип:</span> ${file.type}</div>
                    <div><span class="card-meta">Описание:</span> ${file.description}</div>
                    <div><span class="card-meta">Проект:</span> ${project.title}</div>
                </div>
            `,
      );
    });
  });
}

function renderProject() {
  const title = document.getElementById("projectTitle");
  const description = document.getElementById("projectDescription");
  const deadline = document.getElementById("projectDeadline");
  const members = document.getElementById("projectMembers");
  const roleBadge = document.getElementById("projectRoleBadge");
  const statusBadge = document.getElementById("projectStatusBadge");
  const summary = document.getElementById("projectTaskSummary");
  const board = document.getElementById("projectBoard");
  const currentRoleTitle = document.getElementById("projectCurrentRoleTitle");
  const currentRoleText = document.getElementById("projectCurrentRoleText");
  const actionButtons = document.getElementById("projectActionButtons");
  const deadlinesBox = document.getElementById("projectDeadlines");
  const filesBox = document.getElementById("projectFiles");
  const discussionBox = document.getElementById("projectDiscussion");

  if (
    !title ||
    !description ||
    !deadline ||
    !members ||
    !roleBadge ||
    !statusBadge ||
    !summary ||
    !board ||
    !currentRoleTitle ||
    !currentRoleText ||
    !actionButtons ||
    !deadlinesBox ||
    !filesBox ||
    !discussionBox
  ) {
    return;
  }

  syncProjects();

  const params = new URLSearchParams(window.location.search);
  const project = getProject(params.get("project"));

  document.title = `TaskHub — ${project.title}`;
  title.textContent = project.title;
  description.textContent = project.description;
  deadline.textContent = project.deadline;
  roleBadge.textContent = project.role;
  statusBadge.textContent = project.status;
  summary.textContent = `${project.tasks.length} задач`;
  currentRoleTitle.textContent = project.role;
  currentRoleText.textContent = getRoleDescription(project.role);

  renderProjectMembers(members, project.members);
  renderProjectActions(actionButtons, project);
  renderProjectBoard(board, project);
  renderProjectDeadlines(deadlinesBox, project.deadlines);
  renderProjectFiles(filesBox, project);
  renderProjectDiscussion(discussionBox, project.discussion);

  bindProjectActionButtons(project);
  bindProjectTaskCards(project);
  bindProjectFiles(project);
}
