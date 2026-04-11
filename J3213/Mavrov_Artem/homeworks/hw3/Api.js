var API_BASE = 'http://localhost:3001';

var _token = sessionStorage.getItem('mlpipe_token') || null;

function setToken(t) {
  _token = t;
  if (t) sessionStorage.setItem('mlpipe_token', t);
  else   sessionStorage.removeItem('mlpipe_token');
}

function getToken() { return _token; }

function apiFetch(method, path, body) {
  var headers = { 'Content-Type': 'application/json' };
  if (_token) headers['Authorization'] = 'Bearer ' + _token;

  var opts = { method: method, headers: headers };
  if (body) opts.body = JSON.stringify(body);

  return fetch(API_BASE + path, opts).then(function(res) {
    if (res.status === 204) return null;
    return res.json().then(function(data) {
      if (!res.ok) throw new Error(data.error || 'Ошибка сервера (' + res.status + ')');
      return data;
    });
  });
}

function showLoader(show) {
  var el = document.getElementById('api-loader');
  if (el) el.style.display = show ? 'flex' : 'none';
}

function showApiError(msg) {
  var el = document.getElementById('api-error');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(function() { el.style.display = 'none'; }, 4000);
}

var API = {

  login: function(email, password) {
  return apiFetch('GET', '/users?email=' + email + '&password=' + password)
    .then(function(users) {
      if (!users.length) throw new Error('Неверный логин или пароль');
      var user = users[0];
      setToken(user.id);
      return user;
    });
},

  register: function(name, email, password, role) {
  return apiFetch('POST', '/users', {
    name: name,
    email: email,
    password: password,
    role: role
  });
},

  logout: function() {
    return apiFetch('POST', '/auth/logout').finally(function() {
      setToken(null);
    });
  },

  me: function() {
    return apiFetch('GET', '/auth/me');
  },

  getExperiments: function() {
    return apiFetch('GET', '/experiments');
  },

  createExperiment: function(data) {
    return apiFetch('POST', '/experiments', data);
  },

  updateExperiment: function(id, data) {
    return apiFetch('PATCH', '/experiments/' + id, data);
  },

  deleteExperiment: function(id) {
    return apiFetch('DELETE', '/experiments/' + id);
  },

  getModels: function() {
    return apiFetch('GET', '/models');
  },

  createModel: function(data) {
    return apiFetch('POST', '/models', data);
  },

  updateModel: function(id, data) {
    return apiFetch('PATCH', '/models/' + id, data);
  },

  getArtifacts: function() {
    return apiFetch('GET', '/artifacts');
  },

  createArtifact: function(data) {
    return apiFetch('POST', '/artifacts', data);
  },

  deleteArtifact: function(id) {
    return apiFetch('DELETE', '/artifacts/' + id);
  }
};