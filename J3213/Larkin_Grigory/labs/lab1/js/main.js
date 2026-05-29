var savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-bs-theme', savedTheme);

function updateToggleLabel() {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;
  var current = document.documentElement.getAttribute('data-bs-theme');
  btn.textContent = current === 'dark' ? 'Светлая' : 'Тёмная';
}

document.addEventListener('DOMContentLoaded', function () {
  updateToggleLabel();

  var toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-bs-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-bs-theme', next);
      localStorage.setItem('theme', next);
      updateToggleLabel();
    });
  }
});

var registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    var pwd = document.getElementById('reg-password').value;
    var conf = document.getElementById('reg-confirm').value;
    var err = document.getElementById('password-error');
    if (pwd !== conf) {
      e.preventDefault();
      err.classList.remove('d-none');
    } else {
      err.classList.add('d-none');
    }
  });
}
