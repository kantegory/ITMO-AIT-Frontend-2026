(function (global) {
  'use strict';

  function appendProjectCard(list, project) {
    var col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    var href = 'project.html?id=' + (project.id || '');
    col.innerHTML =
      '<div class="card card-body task-card h-100">' +
      '<h5 class="card-title"><a href="' +
      href +
      '" class="text-decoration-none text-dark">' +
      global.ProjectHubUI.escapeHtml(project.name) +
      '</a></h5>' +
      '<p class="card-text small text-muted mb-0">' +
      global.ProjectHubUI.escapeHtml(project.description || '') +
      '</p>' +
      '</div>';
    list.appendChild(col);
  }

  function initDashboardPage() {
    var projectsList = document.getElementById('projects-list');
    if (!projectsList) return;
    if (typeof global.ProjectHubAPI === 'undefined' || typeof global.ProjectHubAuth === 'undefined') return;

    var user = global.ProjectHubAuth.getCurrentUser();
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    var userDropdown = document.getElementById('userDropdown');
    if (userDropdown) userDropdown.textContent = user.name;

    global.ProjectHubAPI.getProjects()
      .then(function (projects) {
        projectsList.innerHTML = '';
        (projects || []).forEach(function (p) { appendProjectCard(projectsList, p); });
      })
      .catch(function () {
        projectsList.innerHTML = '<div class="col-12 text-muted">Не удалось загрузить проекты</div>';
      });

    var tasksList = document.getElementById('tasks-list');
    if (tasksList) {
      global.ProjectHubAPI.searchTasks({ assigneeId: user.id })
        .then(function (tasks) {
          tasksList.innerHTML = '';
          (tasks || []).forEach(function (t) {
            var a = document.createElement('a');
            a.href = 'project.html?id=' + (t.projectId || 1);
            a.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';

            var badgeClass = global.ProjectHubUI.statusBadgeClass[t.status] || 'bg-secondary';
            a.innerHTML =
              '<span>' + global.ProjectHubUI.escapeHtml(t.title) + '</span>' +
              '<span class="badge ' + badgeClass + ' rounded-pill">' + global.ProjectHubUI.getStatusLabel(t.status) + '</span>';
            tasksList.appendChild(a);
          });
        })
        .catch(function () {
          tasksList.innerHTML = '<div class="list-group-item text-muted">Не удалось загрузить задачи</div>';
        });
    }

    var notificationsList = document.getElementById('notifications-list');
    if (notificationsList) {
      global.ProjectHubAPI.getNotifications(user.id)
        .then(function (notifications) {
          notificationsList.innerHTML = '';
          (notifications || []).forEach(function (n) {
            var div = document.createElement('div');
            div.className = 'list-group-item notification-item' + (n.read ? '' : ' unread');
            var timeStr = n.createdAt ? new Date(n.createdAt).toLocaleString('ru-RU') : '';
            div.innerHTML =
              '<div class="d-flex w-100 justify-content-between">' +
              '<h6 class="mb-1">' + global.ProjectHubUI.escapeHtml(n.title) + '</h6>' +
              '<small>' + timeStr + '</small>' +
              '</div>' +
              '<p class="mb-0 small text-muted">' + global.ProjectHubUI.escapeHtml(n.body) + '</p>';
            notificationsList.appendChild(div);
          });
        })
        .catch(function () {
          notificationsList.innerHTML = '<div class="list-group-item text-muted">Не удалось загрузить уведомления</div>';
        });
    }

    var logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', function (e) {
        e.preventDefault();
        global.ProjectHubAuth.logout();
        window.location.href = 'login.html';
      });
    }

    var formAddProject = document.getElementById('form-add-project');
    if (!formAddProject) return;

    formAddProject.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('project-name').value.trim();
      var desc = document.getElementById('project-desc').value.trim() || '0 задач · 0 участников';

      global.ProjectHubAPI.addProject(name, desc)
        .then(function (project) {
          appendProjectCard(projectsList, project);
          var modalEl = document.getElementById('modalAddProject');
          if (modalEl && typeof bootstrap !== 'undefined') bootstrap.Modal.getInstance(modalEl).hide();
          formAddProject.reset();
        })
        .catch(function () {
          appendProjectCard(projectsList, { id: Date.now(), name: name, description: desc });
          var modalEl = document.getElementById('modalAddProject');
          if (modalEl && typeof bootstrap !== 'undefined') bootstrap.Modal.getInstance(modalEl).hide();
          formAddProject.reset();
        });
    });
  }

  global.ProjectHubDashboardPage = { init: initDashboardPage };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboardPage);
  } else {
    initDashboardPage();
  }
})(typeof window !== 'undefined' ? window : this);

