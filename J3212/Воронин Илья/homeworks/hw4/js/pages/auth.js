(function (global) {
  'use strict';

  function initAuthPage() {
    var loginForm = document.getElementById('login-form');
    if (loginForm && typeof global.ProjectHubAPI !== 'undefined') {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var errEl = document.getElementById('login-error');
        var email = document.getElementById('login-email').value.trim();
        var password = document.getElementById('login-password').value;

        if (errEl) errEl.classList.add('d-none');

        global.ProjectHubAPI.login(email, password).then(function () {
          window.location.href = 'dashboard.html';
        }).catch(function (err) {
          if (errEl) {
            errEl.textContent = (err && err.message) || 'Ошибка входа';
            errEl.classList.remove('d-none');
          }
        });
      });
    }

    var registerForm = document.getElementById('register-form');
    if (registerForm && typeof global.ProjectHubAPI !== 'undefined') {
      registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var errEl = document.getElementById('register-error');
        var name = document.getElementById('reg-name').value.trim();
        var email = document.getElementById('reg-email').value.trim();
        var password = document.getElementById('reg-password').value;

        var confirmEl = document.getElementById('reg-password-confirm');
        if (confirmEl && password !== confirmEl.value) {
          if (errEl) {
            errEl.textContent = 'Пароли не совпадают';
            errEl.classList.remove('d-none');
          }
          return;
        }

        if (errEl) errEl.classList.add('d-none');

        global.ProjectHubAPI.register(name, email, password).then(function () {
          window.location.href = 'login.html';
        }).catch(function (err) {
          if (errEl) {
            errEl.textContent = (err && err.message) || 'Ошибка регистрации';
            errEl.classList.remove('d-none');
          }
        });
      });
    }
  }

  global.ProjectHubAuthPage = { init: initAuthPage };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthPage);
  } else {
    initAuthPage();
  }
})(typeof window !== 'undefined' ? window : this);

