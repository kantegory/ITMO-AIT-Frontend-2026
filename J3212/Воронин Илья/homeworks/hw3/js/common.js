(function (global) {
  'use strict';

  var priorityClass = {
    low: 'badge-priority-low',
    medium: 'badge-priority-medium',
    high: 'badge-priority-high',
    critical: 'badge-priority-critical',
  };

  var priorityLabelFallback = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    critical: 'Критический',
  };

  var statusLabelFallback = {
    new: 'Новая',
    progress: 'В работе',
    review: 'На проверке',
    done: 'Выполнена',
  };

  var statusBadgeClass = {
    new: 'bg-info',
    progress: 'bg-primary',
    review: 'bg-warning text-dark',
    done: 'bg-success',
  };

  function formatDate(str) {
    if (!str) return '—';
    var parts = String(str).split('-');
    return parts[2] + '.' + parts[1] + '.' + parts[0];
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getStatusLabel(s) {
    if (typeof ProjectHubI18n !== 'undefined' && ProjectHubI18n.t[ProjectHubI18n.getLang()]) {
      var key = 'status_' + s;
      var langMap = ProjectHubI18n.t[ProjectHubI18n.getLang()];
      if (langMap && langMap[key]) return langMap[key];
    }
    return statusLabelFallback[s] || s;
  }

  function getPriorityLabel(p) {
    if (typeof ProjectHubI18n !== 'undefined' && ProjectHubI18n.t[ProjectHubI18n.getLang()]) {
      var key = 'priority_' + p;
      var langMap = ProjectHubI18n.t[ProjectHubI18n.getLang()];
      if (langMap && langMap[key]) return langMap[key];
    }
    return priorityLabelFallback[p] || p;
  }

  function getQueryParam(name) {
    var m =
      typeof location !== 'undefined' && location.search
        ? location.search.match(new RegExp('[?&]' + name + '=([^&]*)'))
        : null;
    return m ? decodeURIComponent(m[1]) : '';
  }

  global.ProjectHubUI = {
    priorityClass: priorityClass,
    priorityLabelFallback: priorityLabelFallback,
    statusLabelFallback: statusLabelFallback,
    statusBadgeClass: statusBadgeClass,
    formatDate: formatDate,
    escapeHtml: escapeHtml,
    getStatusLabel: getStatusLabel,
    getPriorityLabel: getPriorityLabel,
    getQueryParam: getQueryParam,
  };
})(typeof window !== 'undefined' ? window : this);

