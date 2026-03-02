(function (global) {
  'use strict';

  var API_BASE = 'http://localhost:3000';

  function request(path, options) {
    options = options || {};
    var url = API_BASE + path;
    var init = {
      headers: { 'Content-Type': 'application/json' }
    };
    if (options.method) init.method = options.method;
    if (options.body) init.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    return fetch(url, init).then(function (res) {
      if (!res.ok) throw new Error('API error: ' + res.status);
      return res.headers.get('content-type') && res.headers.get('content-type').indexOf('json') !== -1 ? res.json() : res.text();
    });
  }

  var api = {
    login: function (email, password) {
      return request('/users?email=' + encodeURIComponent(email)).then(function (users) {
        if (!users || users.length === 0) throw new Error('Пользователь не найден');
        var user = users[0];
        if (user.password !== password) throw new Error('Неверный пароль');
        return { id: user.id, name: user.name, email: user.email };
      });
    },
    register: function (name, email, password) {
      return request('/users?email=' + encodeURIComponent(email)).then(function (existing) {
        if (existing && existing.length > 0) throw new Error('Пользователь с таким email уже существует');
        return request('/users', { method: 'POST', body: { name: name, email: email, password: password } });
      });
    },
    getProjects: function () {
      return request('/projects');
    },
    getProject: function (id) {
      return request('/projects/' + id);
    },
    addProject: function (name, description) {
      return request('/projects', { method: 'POST', body: { name: name, description: description || '0 задач · 0 участников' } });
    },
    getTasks: function (projectId) {
      return request('/tasks?projectId=' + projectId);
    },
    addTask: function (task) {
      return request('/tasks', { method: 'POST', body: task });
    },
    getNotifications: function (userId) {
      return request('/notifications?userId=' + userId);
    },
    getDiscussions: function (projectId) {
      return request('/discussions?projectId=' + projectId);
    },
    addDiscussion: function (projectId, authorName, text) {
      return request('/discussions', { method: 'POST', body: { projectId: projectId, authorName: authorName, text: text, createdAt: new Date().toISOString() } });
    },
    searchTasks: function (params) {
      var q = [];
      if (params.status) q.push('status=' + encodeURIComponent(params.status));
      if (params.priority) q.push('priority=' + encodeURIComponent(params.priority));
      if (params.assigneeId) q.push('assigneeId=' + encodeURIComponent(params.assigneeId));
      if (params.projectId) q.push('projectId=' + encodeURIComponent(params.projectId));
      if (params.title_like) q.push('title_like=' + encodeURIComponent(params.title_like));
      return request('/tasks?' + q.join('&'));
    },
    getUsers: function () {
      return request('/users').then(function (users) {
        return (users || []).map(function (u) { return { id: u.id, name: u.name, email: u.email }; });
      });
    }
  };

  global.ProjectHubAPI = api;
})(typeof window !== 'undefined' ? window : this);
