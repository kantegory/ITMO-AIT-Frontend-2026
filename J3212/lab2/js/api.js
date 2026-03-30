(function (global) {
  'use strict';

  var API_BASE = 'http://localhost:3000';

  var AUTH_USER_KEY = 'projecthub_user';
  var AUTH_TOKEN_KEY = 'projecthub_token';

  function safeParse(raw) {
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function getCurrentUser() {
    try {
      return safeParse(localStorage.getItem(AUTH_USER_KEY));
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    try {
      if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(AUTH_USER_KEY);
    } catch (e) {}
  }

  function getToken() {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch (e) {
      return null;
    }
  }

  function setToken(token) {
    try {
      if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
      else localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {}
  }

  function setAuth(user, token) {
    setCurrentUser(user);
    setToken(token);
  }

  function clearAuth() {
    setCurrentUser(null);
    setToken(null);
  }

  function request(path, options) {
    options = options || {};
    var url = API_BASE + path;
    var init = { headers: { 'Content-Type': 'application/json' } };

    if (options.method) init.method = options.method;
    if (options.body) init.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);

    var token = getToken();
    if (token && options.auth !== false) {
      init.headers.Authorization = 'Bearer ' + token;
    }

    return fetch(url, init).then(function (res) {
      if (res.status === 401) {
        clearAuth();
        if (typeof window !== 'undefined') window.location.href = 'login.html';
        throw new Error('Unauthorized');
      }

      if (!res.ok) throw new Error('API error: ' + res.status);

      var ct = res.headers.get('content-type') || '';
      return ct.indexOf('json') !== -1 ? res.json() : res.text();
    });
  }

  function toUserProjection(data) {
    return data && data.id ? { id: data.id, name: data.name, email: data.email } : null;
  }

  var api = {
    login: function (email, password) {
      return request('/auth/login', { method: 'POST', auth: false, body: { email: email, password: password } })
        .then(function (data) {
          var user = toUserProjection(data && data.user);
          if (!user) throw new Error('Ошибка ответа сервера');
          setAuth(user, data.token);
          return user;
        });
    },
    register: function (name, email, password) {
      return request('/auth/register', { method: 'POST', auth: false, body: { name: name, email: email, password: password } })
        .then(function (data) {
          var user = toUserProjection(data && data.user);
          if (!user) throw new Error('Ошибка ответа сервера');
          setAuth(user, data.token);
          return user;
        });
    },
    logout: function () {
      clearAuth();
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
    getTask: function (taskId) {
      return request('/tasks/' + taskId);
    },
    addTask: function (task) {
      return request('/tasks', { method: 'POST', body: task });
    },
    updateTask: function (taskId, patch) {
      return request('/tasks/' + taskId, { method: 'PATCH', body: patch });
    },
    getTaskComments: function (taskId) {
      return request('/taskComments?taskId=' + encodeURIComponent(taskId));
    },
    addTaskComment: function (taskId, authorName, text) {
      return request('/taskComments', {
        method: 'POST',
        body: {
          taskId: taskId,
          authorName: authorName,
          text: text,
          createdAt: new Date().toISOString()
        }
      });
    },
    getTaskFiles: function (taskId) {
      return request('/taskFiles?taskId=' + encodeURIComponent(taskId));
    },
    addTaskFile: function (taskId, uploadedBy, fileMeta) {
      return request('/taskFiles', {
        method: 'POST',
        body: {
          taskId: taskId,
          uploadedBy: uploadedBy,
          fileName: fileMeta.fileName,
          fileSize: fileMeta.fileSize,
          fileType: fileMeta.fileType || '',
          uploadedAt: new Date().toISOString()
        }
      });
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
      return request('/users');
    }
  };

  api._auth = { getCurrentUser: getCurrentUser, setAuth: setAuth, clearAuth: clearAuth, getToken: getToken };
  global.ProjectHubAPI = api;
  global.ProjectHubAuth = {
    getCurrentUser: getCurrentUser,
    getToken: getToken,
    setAuth: setAuth,
    logout: clearAuth
  };
})(typeof window !== 'undefined' ? window : this);
