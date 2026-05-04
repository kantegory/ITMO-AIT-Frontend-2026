(function (global) {
  'use strict';

  function initSearchPage() {
    var searchForm = document.getElementById('search-form');
    if (!searchForm) return;
    if (typeof global.ProjectHubAPI === 'undefined' || typeof global.ProjectHubAuth === 'undefined') return;

    var user = global.ProjectHubAuth.getCurrentUser();
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    global.ProjectHubAPI.getUsers().then(function (users) {
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

      global.ProjectHubAPI.searchTasks(params).then(function (tasks) {
        var container = document.getElementById('search-results');
        if (!container) return;
        container.innerHTML = '';

        (tasks || []).forEach(function (t) {
          var col = document.createElement('div');
          col.className = 'col-12';

          var statusCl = t.status ? 'badge-status-' + t.status : 'bg-secondary';
          var prioCl = t.priority ? 'badge-priority-' + t.priority : '';
          var statusBadge =
            '<span class="badge ' + statusCl + '">' + global.ProjectHubUI.getStatusLabel(t.status) + '</span>';
          var prioBadge =
            t.priority ? '<span class="badge ' + prioCl + '">' + global.ProjectHubUI.getPriorityLabel(t.priority) + '</span>' : '';

          col.innerHTML =
            '<div class="card">' +
            '<div class="card-body d-flex flex-wrap align-items-center gap-2">' +
            statusBadge +
            prioBadge +
            '<strong>' +
            global.ProjectHubUI.escapeHtml(t.title) +
            '</strong>' +
            '<span class="text-muted small">Проект #' +
            (t.projectId || '') +
            ' · ' +
            global.ProjectHubUI.escapeHtml(t.assigneeName || '') +
            '</span>' +
            '<a href="project.html?id=' +
            (t.projectId || '') +
            '" class="btn btn-sm btn-outline-primary ms-auto">Открыть</a>' +
            '</div>' +
            '</div>';

          container.appendChild(col);
        });
      }).catch(function () {
        var container = document.getElementById('search-results');
        if (container) container.innerHTML = '<div class="col-12 text-muted">Не удалось загрузить результаты</div>';
      });
    });

    var resetBtn = document.querySelector('#search-form button[type="reset"]');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        setTimeout(function () {
          var container = document.getElementById('search-results');
          if (container) container.innerHTML = '';
        }, 0);
      });
    }
  }

  global.ProjectHubSearchPage = { init: initSearchPage };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchPage);
  } else {
    initSearchPage();
  }
})(typeof window !== 'undefined' ? window : this);

