(function (global) {
  'use strict';

  function initProjectPage() {
    var projectTitleEl = document.getElementById('project-title');
    var boardRoot = document.querySelector('.kanban-column-cards[data-column]');
    if (!projectTitleEl || !boardRoot) return;

    if (typeof global.ProjectHubAPI === 'undefined' || typeof global.ProjectHubAuth === 'undefined') return;

    var user = global.ProjectHubAuth.getCurrentUser();
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    var projectId = parseInt(global.ProjectHubUI.getQueryParam('id') || '1', 10);
    var tasksById = {};
    var openedTaskId = null;
    var isDragging = false;

    function saveTaskToCache(task) {
      if (task && task.id) tasksById[String(task.id)] = task;
    }

    function getTaskFromCache(taskId) {
      return tasksById[String(taskId)] || null;
    }

    function renderTaskCard(task) {
      var column = document.querySelector('.kanban-column-cards[data-column="' + (task.status || 'new') + '"]');
      if (!column) return;

      saveTaskToCache(task);

      var card = document.createElement('div');
      card.className = 'card kanban-card mb-2 task-clickable';
      card.draggable = true;
      card.dataset.taskId = String(task.id || '');

      var badge = task.priority
        ? '<span class="badge ' +
          (global.ProjectHubUI.priorityClass[task.priority] || '') +
          ' mb-1">' +
          global.ProjectHubUI.getPriorityLabel(task.priority) +
          '</span>'
        : '';

      card.innerHTML =
        '<div class="card-body py-2">' +
          badge +
          '<p class="mb-0 small">' + global.ProjectHubUI.escapeHtml(task.title) + '</p>' +
        '</div>';

      card.addEventListener('dragstart', function (e) {
        isDragging = true;
        try {
          e.dataTransfer.setData('text/task-id', card.dataset.taskId || '');
          e.dataTransfer.effectAllowed = 'move';
        } catch (err) {}
      });

      card.addEventListener('dragend', function () {
        setTimeout(function () { isDragging = false; }, 0);
      });

      card.addEventListener('click', function () {
        if (isDragging) return;
        openTaskDetails(card.dataset.taskId);
      });

      column.appendChild(card);
    }

    function renderTaskRow(task) {
      var tbody = document.getElementById('deadlines-tbody');
      if (!tbody) return;

      var row = document.createElement('tr');
      row.className = 'task-clickable';
      row.dataset.taskId = String(task.id || '');

      row.innerHTML =
        '<td>' + global.ProjectHubUI.escapeHtml(task.title) + '</td>' +
        '<td>' + global.ProjectHubUI.escapeHtml(task.assigneeName || '') + '</td>' +
        '<td>' + global.ProjectHubUI.formatDate(task.deadline) + '</td>' +
        '<td><span class="badge ' + (global.ProjectHubUI.statusBadgeClass[task.status] || 'bg-secondary') + '">' +
          global.ProjectHubUI.getStatusLabel(task.status) +
        '</span></td>';

      row.addEventListener('click', function () {
        openTaskDetails(row.dataset.taskId);
      });

      tbody.appendChild(row);
    }

    function renderBoard(tasks) {
      tasksById = {};
      var cols = document.querySelectorAll('.kanban-column-cards[data-column]');
      if (cols && cols.length) cols.forEach(function (c) { c.innerHTML = ''; });

      var tbody = document.getElementById('deadlines-tbody');
      if (tbody) tbody.innerHTML = '';

      (tasks || []).forEach(function (t) {
        renderTaskCard(t);
        renderTaskRow(t);
      });
    }

    function loadBoard() {
      return global.ProjectHubAPI.getTasks(projectId)
        .then(function (tasks) { renderBoard(tasks); })
        .catch(function () {
          var tbody = document.getElementById('deadlines-tbody');
          if (tbody) tbody.innerHTML = '<tr><td colspan="4" class="text-muted">Не удалось загрузить задачи</td></tr>';
        });
    }

    function loadUsersForAssignees() {
      return global.ProjectHubAPI.getUsers()
        .then(function (users) {
          var sel = document.getElementById('task-assignee');
          if (!sel) return;
          sel.innerHTML = '';
          (users || []).forEach(function (u) {
            var opt = document.createElement('option');
            opt.value = u.id;
            opt.textContent = u.name;
            sel.appendChild(opt);
          });
        })
        .catch(function () {});
    }

    function loadDiscussions() {
      return global.ProjectHubAPI.getDiscussions(projectId)
        .then(function (discussions) {
          var list = document.getElementById('discussions-list');
          if (!list) return;
          list.innerHTML = '';
          (discussions || []).forEach(function (d) {
            var card = document.createElement('div');
            card.className = 'card mb-3';
            var dateStr = d.createdAt ? new Date(d.createdAt).toLocaleString('ru-RU') : '';
            card.innerHTML =
              '<div class="card-body">' +
              '<div class="d-flex justify-content-between mb-2">' +
              '<strong>' +
              global.ProjectHubUI.escapeHtml(d.authorName) +
              '</strong>' +
              '<small class="text-muted">' +
              global.ProjectHubUI.escapeHtml(dateStr) +
              '</small>' +
              '</div>' +
              '<p class="mb-0">' +
              global.ProjectHubUI.escapeHtml(d.text) +
              '</p>' +
              '</div>';
            list.appendChild(card);
          });
        })
        .catch(function () {
          var list = document.getElementById('discussions-list');
          if (list) list.innerHTML = '<div class="text-muted">Не удалось загрузить обсуждения</div>';
        });
    }

    function initDragAndDrop() {
      var columns = document.querySelectorAll('.kanban-column-cards[data-column]');
      if (!columns || !columns.length) return;

      columns.forEach(function (col) {
        col.addEventListener('dragover', function (e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          col.classList.add('drag-over');
        });

        col.addEventListener('dragleave', function () {
          col.classList.remove('drag-over');
        });

        col.addEventListener('drop', function (e) {
          e.preventDefault();
          col.classList.remove('drag-over');

          var taskIdRaw = '';
          try { taskIdRaw = e.dataTransfer.getData('text/task-id') || ''; } catch (err) {}
          var taskId = parseInt(taskIdRaw, 10);
          var targetStatus = col.dataset.column;

          if (!taskId || !targetStatus) return;
          var task = getTaskFromCache(taskId);
          if (task && task.status === targetStatus) return;

          global.ProjectHubAPI.updateTask(taskId, { status: targetStatus }).then(function () {
            return loadBoard();
          }).then(function () {
            if (openedTaskId && String(openedTaskId) === String(taskId)) {
              openTaskDetails(String(taskId));
            }
          }).catch(function () {});
        });
      });
    }

    function renderTaskDetailsHeader(task) {
      var titleEl = document.getElementById('task-details-title');
      var statusEl = document.getElementById('task-details-status');
      var prioEl = document.getElementById('task-details-priority');
      var assigneeEl = document.getElementById('task-details-assignee');
      var deadlineEl = document.getElementById('task-details-deadline');

      if (titleEl) titleEl.textContent = task.title || 'Задача';
      if (statusEl) {
        statusEl.className = 'badge ' + (global.ProjectHubUI.statusBadgeClass[task.status] || 'bg-secondary');
        statusEl.textContent = global.ProjectHubUI.getStatusLabel(task.status);
      }
      if (prioEl) {
        prioEl.className = 'badge ' + (task.priority ? (global.ProjectHubUI.priorityClass[task.priority] || 'bg-light text-dark') : 'bg-light text-dark');
        prioEl.textContent = task.priority ? global.ProjectHubUI.getPriorityLabel(task.priority) : 'Без приоритета';
      }
      if (assigneeEl) assigneeEl.textContent = 'Исполнитель: ' + (task.assigneeName || '—');
      if (deadlineEl) deadlineEl.textContent = 'Срок: ' + global.ProjectHubUI.formatDate(task.deadline);
    }

    function renderTaskComments(comments) {
      var list = document.getElementById('task-comments-list');
      if (!list) return;
      list.innerHTML = '';
      if (!comments || !comments.length) {
        list.innerHTML = '<div class="text-muted small">Комментариев пока нет</div>';
        return;
      }
      comments.forEach(function (c) {
        var div = document.createElement('div');
        div.className = 'comment-item';
        var dateStr = c.createdAt ? new Date(c.createdAt).toLocaleString('ru-RU') : '';
        div.innerHTML =
          '<div class="d-flex justify-content-between">' +
            '<strong>' + global.ProjectHubUI.escapeHtml(c.authorName || 'Пользователь') + '</strong>' +
            '<small class="text-muted">' + global.ProjectHubUI.escapeHtml(dateStr) + '</small>' +
          '</div>' +
          '<div class="small">' + global.ProjectHubUI.escapeHtml(c.text || '') + '</div>';
        list.appendChild(div);
      });
    }

    function renderTaskFiles(files) {
      var list = document.getElementById('task-files-list');
      if (!list) return;
      list.innerHTML = '';
      if (!files || !files.length) {
        list.innerHTML = '<div class="text-muted small">Вложений пока нет</div>';
        return;
      }
      files.forEach(function (f) {
        var item = document.createElement('div');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        var sizeKb = f.fileSize ? Math.max(1, Math.round(Number(f.fileSize) / 1024)) + ' KB' : '—';
        item.innerHTML =
          '<span class="small">' + global.ProjectHubUI.escapeHtml(f.fileName || 'Файл') + '</span>' +
          '<span class="badge bg-secondary">' + sizeKb + '</span>';
        list.appendChild(item);
      });
    }

    function openTaskDetails(taskId) {
      if (!taskId) return;
      openedTaskId = String(taskId);

      var task = getTaskFromCache(taskId);
      if (!task) return;
      renderTaskDetailsHeader(task);

      Promise.all([
        global.ProjectHubAPI.getTaskComments(taskId).catch(function () { return []; }),
        global.ProjectHubAPI.getTaskFiles(taskId).catch(function () { return []; })
      ]).then(function (result) {
        renderTaskComments(result[0] || []);
        renderTaskFiles(result[1] || []);
      });

      var modalEl = document.getElementById('modalTaskDetails');
      if (modalEl && typeof bootstrap !== 'undefined') {
        var m = bootstrap.Modal.getOrCreateInstance(modalEl);
        m.show();
      }
    }

    global.ProjectHubAPI.getProject(projectId)
      .then(function (project) { projectTitleEl.textContent = project.name || 'Проект'; })
      .catch(function () { projectTitleEl.textContent = 'Проект'; });

    loadUsersForAssignees();

    loadDiscussions();

    loadBoard().then(function () { initDragAndDrop(); });

    var formAddTask = document.getElementById('form-add-task');
    if (formAddTask) {
      formAddTask.addEventListener('submit', function (e) {
        e.preventDefault();

        var title = document.getElementById('task-title').value.trim();
        var status = document.getElementById('task-status').value;
        var priority = document.getElementById('task-priority').value;

        var assigneeSelect = document.getElementById('task-assignee');
        var assigneeOption = assigneeSelect && assigneeSelect.options
          ? assigneeSelect.options[assigneeSelect.selectedIndex]
          : null;

        var assigneeId = assigneeOption ? assigneeOption.value : '';
        var assigneeName = assigneeOption ? assigneeOption.text : '';

        var deadline = document.getElementById('task-deadline').value;

        global.ProjectHubAPI.addTask({
          projectId: projectId,
          title: title,
          status: status,
          priority: priority,
          assigneeId: assigneeId ? parseInt(assigneeId, 10) : null,
          assigneeName: assigneeName,
          deadline: deadline || null,
        }).then(function () {
          var modalEl = document.getElementById('modalAddTask');
          if (modalEl && typeof bootstrap !== 'undefined') bootstrap.Modal.getInstance(modalEl).hide();
          formAddTask.reset();
          return loadBoard();
        });
      });
    }

    var discussionSend = document.getElementById('discussion-send');
    var discussionMessage = document.getElementById('discussion-message');
    if (discussionSend && discussionMessage) {
      discussionSend.addEventListener('click', function () {
        var text = discussionMessage.value.trim();
        if (!text) return;

        var list = document.getElementById('discussions-list');
        var authorName = user ? user.name : 'Пользователь';

        global.ProjectHubAPI.addDiscussion(projectId, authorName, text)
          .then(function (d) {
            if (list) {
              var card = document.createElement('div');
              card.className = 'card mb-3';
              var dateStr = d.createdAt ? new Date(d.createdAt).toLocaleString('ru-RU') : '';
              card.innerHTML =
                '<div class="card-body">' +
                '<div class="d-flex justify-content-between mb-2">' +
                '<strong>' +
                global.ProjectHubUI.escapeHtml(d.authorName) +
                '</strong>' +
                '<small class="text-muted">' +
                global.ProjectHubUI.escapeHtml(dateStr) +
                '</small>' +
                '</div>' +
                '<p class="mb-0">' +
                global.ProjectHubUI.escapeHtml(d.text) +
                '</p>' +
                '</div>';
              list.appendChild(card);
            }
            discussionMessage.value = '';
          })
          .catch(function () {
            discussionMessage.value = '';
          });
      });
    }

    var commentSend = document.getElementById('task-comment-send');
    var commentInput = document.getElementById('task-comment-input');
    if (commentSend && commentInput) {
      commentSend.addEventListener('click', function () {
        if (!openedTaskId) return;
        var text = commentInput.value.trim();
        if (!text) return;

        global.ProjectHubAPI.addTaskComment(parseInt(openedTaskId, 10), user ? user.name : 'Пользователь', text)
          .then(function () {
            commentInput.value = '';
            return global.ProjectHubAPI.getTaskComments(parseInt(openedTaskId, 10));
          })
          .then(function (comments) {
            renderTaskComments(comments || []);
          });
      });
    }

    var fileUploadBtn = document.getElementById('task-file-upload');
    var fileInput = document.getElementById('task-file-input');
    if (fileUploadBtn && fileInput) {
      fileUploadBtn.addEventListener('click', function () {
        if (!openedTaskId || !fileInput.files || !fileInput.files.length) return;
        var files = Array.prototype.slice.call(fileInput.files);

        var queue = files.map(function (f) {
          return global.ProjectHubAPI.addTaskFile(parseInt(openedTaskId, 10), user ? user.name : 'Пользователь', {
            fileName: f.name,
            fileSize: f.size,
            fileType: f.type || ''
          });
        });

        Promise.all(queue).then(function () {
          fileInput.value = '';
          return global.ProjectHubAPI.getTaskFiles(parseInt(openedTaskId, 10));
        }).then(function (taskFiles) {
          renderTaskFiles(taskFiles || []);
        });
      });
    }
  }

  global.ProjectHubProjectPage = { init: initProjectPage };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectPage);
  } else {
    initProjectPage();
  }
})(typeof window !== 'undefined' ? window : this);

