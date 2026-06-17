function requireAuth() {
  if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location.href = 'index.html';
}

function login(email, password) {
  return apiGet('/users?email=' + encodeURIComponent(email)).then(function (users) {
    var user = users.find(function (u) { return u.password === password; });
    if (!user) throw new Error('Неверный email или пароль');
    var token = btoa(user.id + ':' + Date.now());
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.id);
    return user;
  });
}

function register(name, email, password) {
  return apiGet('/users?email=' + encodeURIComponent(email)).then(function (users) {
    if (users.length > 0) throw new Error('Пользователь с таким email уже существует');
    return apiPost('/users', { name: name, email: email, password: password });
  }).then(function (user) {
    var token = btoa(user.id + ':' + Date.now());
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.id);
    return user;
  });
}
