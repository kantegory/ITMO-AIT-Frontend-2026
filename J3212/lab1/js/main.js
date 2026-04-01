(function () {
  'use strict';

  var loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = 'dashboard.html';
    });
  }

  var registerForm = document.getElementById('register-form');
  if (registerForm) {
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

  var formAddTask = document.getElementById('form-add-task');
  if (formAddTask) {
    formAddTask.addEventListener('submit', function (e) {
      e.preventDefault();
      var title = document.getElementById('task-title').value.trim();
      var status = document.getElementById('task-status').value;
      var priority = document.getElementById('task-priority').value;
      var assignee = document.getElementById('task-assignee').options[document.getElementById('task-assignee').selectedIndex].text;
      var deadline = document.getElementById('task-deadline').value;

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
        row.innerHTML = '<td>' + escapeHtml(title) + '</td><td>' + escapeHtml(assignee) + '</td><td>' + formatDate(deadline) + '</td><td><span class="badge ' + statusBadgeClass[status] + '">' + statusLabel[status] + '</span></td>';
        tbody.appendChild(row);
      }

      var modalEl = document.getElementById('modalAddTask');
      if (modalEl && typeof bootstrap !== 'undefined') {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      formAddTask.reset();
    });
  }

  var formAddProject = document.getElementById('form-add-project');
  if (formAddProject) {
    formAddProject.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('project-name').value.trim();
      var desc = document.getElementById('project-desc').value.trim() || '0 задач · 0 участников';

      var list = document.getElementById('projects-list');
      if (list) {
        var col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = '<div class="card card-body task-card h-100"><h5 class="card-title"><a href="project.html" class="text-decoration-none text-dark">' + escapeHtml(name) + '</a></h5><p class="card-text small text-muted mb-0">' + escapeHtml(desc) + '</p></div>';
        list.appendChild(col);
      }

      var modalEl = document.getElementById('modalAddProject');
      if (modalEl && typeof bootstrap !== 'undefined') {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
      formAddProject.reset();
    });
  }

  var discussionSend = document.getElementById('discussion-send');
  var discussionMessage = document.getElementById('discussion-message');
  if (discussionSend && discussionMessage) {
    discussionSend.addEventListener('click', function () {
      var text = discussionMessage.value.trim();
      if (!text) return;
      var list = document.getElementById('discussions-list');
      if (list) {
        var now = new Date();
        var dateStr = now.getDate().toString().padStart(2, '0') + '.' + (now.getMonth() + 1).toString().padStart(2, '0') + '.' + now.getFullYear() + ', ' + now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        var card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = '<div class="card-body"><div class="d-flex justify-content-between mb-2"><strong>Пользователь</strong><small class="text-muted">' + dateStr + '</small></div><p class="mb-0">' + escapeHtml(text) + '</p></div>';
        list.appendChild(card);
      }
      discussionMessage.value = '';
    });
  }
})();
