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
