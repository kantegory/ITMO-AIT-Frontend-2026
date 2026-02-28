(function () {
  'use strict';

  var AUTH_STORAGE_KEY = 'projecthub_user';

  function getCurrentUser() {
    try {
      var raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  var loginForm = document.getElementById('login-form');
  if (loginForm && typeof ProjectHubAPI !== 'undefined') {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var errEl = document.getElementById('login-error');
      var email = document.getElementById('login-email').value.trim();
      var password = document.getElementById('login-password').value;
      errEl.classList.add('d-none');
      ProjectHubAPI.login(email, password).then(function (user) {
        setCurrentUser(user);
        window.location.href = 'dashboard.html';
      }).catch(function (err) {
        errEl.textContent = err.message || 'Ошибка входа';
        errEl.classList.remove('d-none');
      });
    });
  } else if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = 'dashboard.html';
    });
  }

  var registerForm = document.getElementById('register-form');
  if (registerForm && typeof ProjectHubAPI !== 'undefined') {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var errEl = document.getElementById('register-error');
      var name = document.getElementById('reg-name').value.trim();
      var email = document.getElementById('reg-email').value.trim();
      var password = document.getElementById('reg-password').value;
      if (password !== document.getElementById('reg-password-confirm').value) {
        errEl.textContent = 'Пароли не совпадают';
        errEl.classList.remove('d-none');
        return;
      }
      errEl.classList.add('d-none');
      ProjectHubAPI.register(name, email, password).then(function () {
        window.location.href = 'login.html';
      }).catch(function (err) {
        errEl.textContent = err.message || 'Ошибка регистрации';
        errEl.classList.remove('d-none');
      });
    });
  } else if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = 'login.html';
    });
  }

  function formatDate(str) {
    if (!str) return '—';
    var parts = str.split('-');
    return parts[2] + '.' + parts[1] + '.' + parts[0];
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var priorityClass = { low: 'badge-priority-low', medium: 'badge-priority-medium', high: 'badge-priority-high', critical: 'badge-priority-critical' };
  var priorityLabel = { low: 'Низкий', medium: 'Средний', high: 'Высокий', critical: 'Критический' };
  var statusLabel = { new: 'Новая', progress: 'В работе', review: 'На проверке', done: 'Выполнена' };
  var statusBadgeClass = { new: 'bg-info', progress: 'bg-primary', review: 'bg-warning text-dark', done: 'bg-success' };

  function getQueryParam(name) {
    var m = typeof location !== 'undefined' && location.search ? location.search.match(new RegExp('[?&]' + name + '=([^&]*)')) : null;
    return m ? decodeURIComponent(m[1]) : '';
  }

  function renderTaskCard(task) {
    var column = document.querySelector('.kanban-column-cards[data-column="' + (task.status || 'new') + '"]');
    if (!column) return;
    var card = document.createElement('div');
    card.className = 'card kanban-card mb-2';
    var badge = task.priority ? '<span class="badge ' + (priorityClass[task.priority] || '') + ' mb-1">' + (priorityLabel[task.priority] || task.priority) + '</span>' : '';
    card.innerHTML = '<div class="card-body py-2">' + badge + '<p class="mb-0 small">' + escapeHtml(task.title) + '</p></div>';
    column.appendChild(card);
  }

  function renderTaskRow(task) {
    var tbody = document.getElementById('deadlines-tbody');
    if (!tbody) return;
    var row = document.createElement('tr');
    row.innerHTML = '<td>' + escapeHtml(task.title) + '</td><td>' + escapeHtml(task.assigneeName || '') + '</td><td>' + formatDate(task.deadline) + '</td><td><span class="badge ' + (statusBadgeClass[task.status] || 'bg-secondary') + '">' + (statusLabel[task.status] || task.status) + '</span></td>';
    tbody.appendChild(row);
  }

  var formAddTask = document.getElementById('form-add-task');
  if (formAddTask) {
    formAddTask.addEventListener('submit', function (e) {
      e.preventDefault();
      var title = document.getElementById('task-title').value.trim();
      var status = document.getElementById('task-status').value;
      var priority = document.getElementById('task-priority').value;
      var assigneeSelect = document.getElementById('task-assignee');
      var assigneeId = assigneeSelect && assigneeSelect.options[assigneeSelect.selectedIndex] ? assigneeSelect.options[assigneeSelect.selectedIndex].value : '';
      var assigneeName = assigneeSelect && assigneeSelect.options[assigneeSelect.selectedIndex] ? assigneeSelect.options[assigneeSelect.selectedIndex].text : '';
      var deadline = document.getElementById('task-deadline').value;
      var projectId = getQueryParam('id') || '1';

      if (typeof ProjectHubAPI !== 'undefined' && projectId) {
        ProjectHubAPI.addTask({ projectId: parseInt(projectId, 10), title: title, status: status, priority: priority, assigneeId: assigneeId ? parseInt(assigneeId, 10) : null, assigneeName: assigneeName, deadline: deadline || null }).then(function (task) {
          renderTaskCard(task);
          renderTaskRow(task);
          var modalEl = document.getElementById('modalAddTask');
          if (modalEl && typeof bootstrap !== 'undefined') bootstrap.Modal.getInstance(modalEl).hide();
          formAddTask.reset();
        }).catch(function () {
          renderTaskCard({ title: title, status: status, priority: priority, assigneeName: assigneeName, deadline: deadline });
          renderTaskRow({ title: title, status: status, assigneeName: assigneeName, deadline: deadline });
          var modalEl = document.getElementById('modalAddTask');
          if (modalEl && typeof bootstrap !== 'undefined') bootstrap.Modal.getInstance(modalEl).hide();
          formAddTask.reset();
        });
      } else {
        var column = document.querySelector('.kanban-column-cards[data-column="' + status + '"]');
        if (column) {
          var card = document.createElement('div');
          card.className = 'card kanban-card mb-2';
          var badge = priority ? '<span class="badge ' + priorityClass[priority] + ' mb-1">' + priorityLabel[priority] + '</span>' : '';
          card.innerHTML = '<div class="card-body py-2">' + badge + '<p class="mb-0 small">' + escapeHtml(title) + '</p></div>';
          column.appendChild(card);
        }
        var tbody = document.getElementById('deadlines-tbody');
        if (tbody) {
          var row = document.createElement('tr');
          row.innerHTML = '<td>' + escapeHtml(title) + '</td><td>' + escapeHtml(assigneeName) + '</td><td>' + formatDate(deadline) + '</td><td><span class="badge ' + statusBadgeClass[status] + '">' + statusLabel[status] + '</span></td>';
          tbody.appendChild(row);
        }
        var modalEl = document.getElementById('modalAddTask');
        if (modalEl && typeof bootstrap !== 'undefined') bootstrap.Modal.getInstance(modalEl).hide();
        formAddTask.reset();
      }
    });
  }

  var formAddProject = document.getElementById('form-add-project');
  if (formAddProject) {
    formAddProject.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('project-name').value.trim();
      var desc = document.getElementById('project-desc').value.trim() || '0 задач · 0 участников';

      if (typeof ProjectHubAPI !== 'undefined') {
        ProjectHubAPI.addProject(name, desc).then(function (project) {
          var list = document.getElementById('projects-list');
          if (list) appendProjectCard(list, project);
          var modalEl = document.getElementById('modalAddProject');
          if (modalEl && typeof bootstrap !== 'undefined') bootstrap.Modal.getInstance(modalEl).hide();
          formAddProject.reset();
        }).catch(function () {
          var list = document.getElementById('projects-list');
          if (list) {
            var col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';
            col.innerHTML = '<div class="card card-body task-card h-100"><h5 class="card-title"><a href="project.html" class="text-decoration-none text-dark">' + escapeHtml(name) + '</a></h5><p class="card-text small text-muted mb-0">' + escapeHtml(desc) + '</p></div>';
            list.appendChild(col);
          }
          var modalEl = document.getElementById('modalAddProject');
          if (modalEl && typeof bootstrap !== 'undefined') bootstrap.Modal.getInstance(modalEl).hide();
          formAddProject.reset();
        });
      } else {
        var list = document.getElementById('projects-list');
        if (list) {
          var col = document.createElement('div');
          col.className = 'col-md-6 col-lg-4';
          col.innerHTML = '<div class="card card-body task-card h-100"><h5 class="card-title"><a href="project.html" class="text-decoration-none text-dark">' + escapeHtml(name) + '</a></h5><p class="card-text small text-muted mb-0">' + escapeHtml(desc) + '</p></div>';
          list.appendChild(col);
        }
        var modalEl = document.getElementById('modalAddProject');
        if (modalEl && typeof bootstrap !== 'undefined') bootstrap.Modal.getInstance(modalEl).hide();
        formAddProject.reset();
      }
    });
  }

  function appendProjectCard(list, project) {
    var col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    var href = 'project.html?id=' + (project.id || '');
    col.innerHTML = '<div class="card card-body task-card h-100"><h5 class="card-title"><a href="' + href + '" class="text-decoration-none text-dark">' + escapeHtml(project.name) + '</a></h5><p class="card-text small text-muted mb-0">' + escapeHtml(project.description || '') + '</p></div>';
    list.appendChild(col);
  }

  var logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      setCurrentUser(null);
      window.location.href = 'login.html';
    });
  }

  var projectsList = document.getElementById('projects-list');
  if (projectsList && typeof ProjectHubAPI !== 'undefined') {
    var user = getCurrentUser();
    if (!user) {
      window.location.href = 'login.html';
    } else {
      var userDropdown = document.getElementById('userDropdown');
      if (userDropdown) userDropdown.textContent = user.name;
      ProjectHubAPI.getProjects().then(function (projects) {
        projectsList.innerHTML = '';
        (projects || []).forEach(function (p) { appendProjectCard(projectsList, p); });
      }).catch(function () {
        projectsList.innerHTML = '<div class="col-12 text-muted">Не удалось загрузить проекты. Запустите API: npm run api</div>';
      });
      var tasksList = document.getElementById('tasks-list');
      if (tasksList) {
        ProjectHubAPI.searchTasks({ assigneeId: user.id }).then(function (tasks) {
          tasksList.innerHTML = '';
          (tasks || []).forEach(function (t) {
            var a = document.createElement('a');
            a.href = 'project.html?id=' + (t.projectId || 1);
            a.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
            var badgeClass = statusBadgeClass[t.status] || 'bg-secondary';
            a.innerHTML = '<span>' + escapeHtml(t.title) + '</span><span class="badge ' + badgeClass + ' rounded-pill">' + (statusLabel[t.status] || t.status) + '</span>';
            tasksList.appendChild(a);
          });
        }).catch(function () {
          tasksList.innerHTML = '<div class="list-group-item text-muted">Не удалось загрузить задачи</div>';
        });
      }
      var notificationsList = document.getElementById('notifications-list');
      if (notificationsList) {
        ProjectHubAPI.getNotifications(user.id).then(function (notifications) {
          notificationsList.innerHTML = '';
          (notifications || []).forEach(function (n) {
            var div = document.createElement('div');
            div.className = 'list-group-item notification-item' + (n.read ? '' : ' unread');
            var timeStr = n.createdAt ? new Date(n.createdAt).toLocaleString('ru-RU') : '';
            div.innerHTML = '<div class="d-flex w-100 justify-content-between"><h6 class="mb-1">' + escapeHtml(n.title) + '</h6><small>' + timeStr + '</small></div><p class="mb-0 small text-muted">' + escapeHtml(n.body) + '</p>';
            notificationsList.appendChild(div);
          });
        }).catch(function () {
          notificationsList.innerHTML = '<div class="list-group-item text-muted">Не удалось загрузить уведомления</div>';
        });
      }
    }
  }

  var discussionSend = document.getElementById('discussion-send');
  var discussionMessage = document.getElementById('discussion-message');
  if (discussionSend && discussionMessage) {
    discussionSend.addEventListener('click', function () {
      var text = discussionMessage.value.trim();
      if (!text) return;
      var list = document.getElementById('discussions-list');
      var projectId = getQueryParam('id') || '1';
      var user = getCurrentUser();
      var authorName = user ? user.name : 'Пользователь';
      if (typeof ProjectHubAPI !== 'undefined' && projectId) {
        ProjectHubAPI.addDiscussion(parseInt(projectId, 10), authorName, text).then(function (d) {
          if (list) {
            var dateStr = d.createdAt ? new Date(d.createdAt).toLocaleString('ru-RU') : '';
            var card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = '<div class="card-body"><div class="d-flex justify-content-between mb-2"><strong>' + escapeHtml(d.authorName) + '</strong><small class="text-muted">' + dateStr + '</small></div><p class="mb-0">' + escapeHtml(d.text) + '</p></div>';
            list.appendChild(card);
          }
          discussionMessage.value = '';
        }).catch(function () {
          if (list) {
            var now = new Date();
            var dateStr = now.toLocaleString('ru-RU');
            var card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = '<div class="card-body"><div class="d-flex justify-content-between mb-2"><strong>' + escapeHtml(authorName) + '</strong><small class="text-muted">' + dateStr + '</small></div><p class="mb-0">' + escapeHtml(text) + '</p></div>';
            list.appendChild(card);
          }
          discussionMessage.value = '';
        });
      } else if (list) {
        var now = new Date();
        var dateStr = now.getDate().toString().padStart(2, '0') + '.' + (now.getMonth() + 1).toString().padStart(2, '0') + '.' + now.getFullYear() + ', ' + now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        var card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = '<div class="card-body"><div class="d-flex justify-content-between mb-2"><strong>Пользователь</strong><small class="text-muted">' + dateStr + '</small></div><p class="mb-0">' + escapeHtml(text) + '</p></div>';
        list.appendChild(card);
        discussionMessage.value = '';
      }
    });
  }

  var searchForm = document.getElementById('search-form');
  if (searchForm && typeof ProjectHubAPI !== 'undefined') {
    ProjectHubAPI.getUsers().then(function (users) {
      var sel = document.getElementById('filter-assignee');
      if (!sel) return;
      var first = sel.querySelector('option');
      sel.innerHTML = first ? first.outerHTML : '<option value="">Любой</option>';
      (users || []).forEach(function (u) {
        var opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = u.name;
        sel.appendChild(opt);
      });
    }).catch(function () {});
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('filter-status').value;
      var priority = document.getElementById('filter-priority').value;
      var assigneeId = document.getElementById('filter-assignee').value;
      var query = document.getElementById('search-query').value.trim();
      var params = {};
      if (status) params.status = status;
      if (priority) params.priority = priority;
      if (assigneeId) params.assigneeId = assigneeId;
      if (query) params.title_like = query;
      ProjectHubAPI.searchTasks(params).then(function (tasks) {
        var container = document.getElementById('search-results');
        if (!container) return;
        container.innerHTML = '';
        (tasks || []).forEach(function (t) {
          var col = document.createElement('div');
          col.className = 'col-12';
          var statusCl = t.status ? 'badge-status-' + t.status : 'bg-secondary';
          var prioCl = t.priority ? 'badge-priority-' + t.priority : '';
          var statusBadge = '<span class="badge ' + statusCl + '">' + (statusLabel[t.status] || t.status || '') + '</span>';
          var prioBadge = t.priority ? '<span class="badge ' + prioCl + '">' + (priorityLabel[t.priority] || t.priority) + '</span>' : '';
          col.innerHTML = '<div class="card"><div class="card-body d-flex flex-wrap align-items-center gap-2">' + statusBadge + prioBadge + '<strong>' + escapeHtml(t.title) + '</strong><span class="text-muted small">Проект #' + (t.projectId || '') + ' · ' + escapeHtml(t.assigneeName || '') + '</span><a href="project.html?id=' + (t.projectId || '') + '" class="btn btn-sm btn-outline-primary ms-auto">Открыть</a></div></div>';
          container.appendChild(col);
        });
      }).catch(function () {
        var container = document.getElementById('search-results');
        if (container) container.innerHTML = '<div class="col-12 text-muted">Не удалось загрузить результаты. Запустите API: npm run api</div>';
      });
    });
    document.getElementById('search-form').addEventListener('reset', function () {
      setTimeout(function () {
        document.getElementById('search-results').innerHTML = '';
      }, 0);
    });
  }

  var projectTitleEl = document.getElementById('project-title');
  if (projectTitleEl && typeof ProjectHubAPI !== 'undefined') {
    var projectId = getQueryParam('id') || '1';
    ProjectHubAPI.getProject(projectId).then(function (project) {
      projectTitleEl.textContent = project.name || 'Проект';
    }).catch(function () {
      projectTitleEl.textContent = 'Проект';
    });
    ProjectHubAPI.getTasks(parseInt(projectId, 10)).then(function (tasks) {
      var cols = document.querySelectorAll('.kanban-column-cards[data-column]');
      if (cols.length) { cols.forEach(function (c) { c.innerHTML = ''; }); }
      var tbody = document.getElementById('deadlines-tbody');
      if (tbody) tbody.innerHTML = '';
      (tasks || []).forEach(function (t) {
        renderTaskCard(t);
        renderTaskRow(t);
      });
    }).catch(function () {
      var tbody = document.getElementById('deadlines-tbody');
      if (tbody) tbody.innerHTML = '<tr><td colspan="4" class="text-muted">Не удалось загрузить задачи. Запустите API: npm run api</td></tr>';
    });
    ProjectHubAPI.getUsers().then(function (users) {
      var sel = document.getElementById('task-assignee');
      if (!sel) return;
      sel.innerHTML = '';
      (users || []).forEach(function (u) {
        var opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = u.name;
        sel.appendChild(opt);
      });
    }).catch(function () {});
    ProjectHubAPI.getDiscussions(parseInt(projectId, 10)).then(function (discussions) {
      var list = document.getElementById('discussions-list');
      if (!list) return;
      list.innerHTML = '';
      (discussions || []).forEach(function (d) {
        var card = document.createElement('div');
        card.className = 'card mb-3';
        var dateStr = d.createdAt ? new Date(d.createdAt).toLocaleString('ru-RU') : '';
        card.innerHTML = '<div class="card-body"><div class="d-flex justify-content-between mb-2"><strong>' + escapeHtml(d.authorName) + '</strong><small class="text-muted">' + dateStr + '</small></div><p class="mb-0">' + escapeHtml(d.text) + '</p></div>';
        list.appendChild(card);
      });
    }).catch(function () {
      var list = document.getElementById('discussions-list');
      if (list) list.innerHTML = '<div class="text-muted">Не удалось загрузить обсуждения</div>';
    });
  }
})();
