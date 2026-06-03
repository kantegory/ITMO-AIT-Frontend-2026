function getSession() {
  var userId = localStorage.getItem('userId');
  return userId ? parseInt(userId, 10) : null;
}

function requireAuth() {
  if (!getSession()) {
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('userId');
  window.location.href = 'login.html';
}

function handleLogin(e) {
  e.preventDefault();
  var email = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value;
  var errorEl = document.getElementById('authError');

  api('/users?email=' + encodeURIComponent(email))
    .then(function (users) {
      if (users.length === 0 || users[0].password !== password) {
        errorEl.textContent = 'Invalid email or password';
        errorEl.classList.remove('d-none');
        return;
      }
      localStorage.setItem('userId', users[0].id);
      window.location.href = 'index.html';
    })
    .catch(function () {
      errorEl.textContent = 'Server error. Is json-server running?';
      errorEl.classList.remove('d-none');
    });
}

function handleRegister(e) {
  e.preventDefault();
  var firstName = document.getElementById('firstName').value.trim();
  var lastName = document.getElementById('lastName').value.trim();
  var email = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value;
  var confirm = document.getElementById('confirmPassword').value;
  var errorEl = document.getElementById('authError');

  if (password !== confirm) {
    errorEl.textContent = 'Passwords do not match';
    errorEl.classList.remove('d-none');
    return;
  }

  api('/users?email=' + encodeURIComponent(email))
    .then(function (existing) {
      if (existing.length > 0) {
        errorEl.textContent = 'User with this email already exists';
        errorEl.classList.remove('d-none');
        return;
      }
      return apiPost('/users', {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: 'Viewer',
        team: '',
        timezone: '',
        memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });
    })
    .then(function (user) {
      if (user && user.id) {
        localStorage.setItem('userId', user.id);
        window.location.href = 'index.html';
      }
    })
    .catch(function () {
      errorEl.textContent = 'Server error. Is json-server running?';
      errorEl.classList.remove('d-none');
    });
}
