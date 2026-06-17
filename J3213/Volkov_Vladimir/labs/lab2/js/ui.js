function showToast(message) {
  const toastText = document.getElementById('toastText');
  const toastEl = document.getElementById('liveToast');

  if (!toastText || !toastEl || typeof bootstrap === 'undefined') return;

  toastText.textContent = message;
  new bootstrap.Toast(toastEl).show();
}

function initPasswordToggle() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');

  if (!toggleButtons.length) return;

  const eyeOpenIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;

  const eyeClosedIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 3l18 18"></path>
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"></path>
      <path d="M9.4 5.4A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-2.2 2.9"></path>
      <path d="M6.7 6.7C4.3 8.2 2.7 10.9 2 12c0 0 3.5 7 10 7a9.8 9.8 0 0 0 5.3-1.5"></path>
    </svg>
  `;

  toggleButtons.forEach((button) => {
    const targetId = button.dataset.target;
    const input = document.getElementById(targetId);
    const icon = button.querySelector('.eye-icon');

    if (!input || !icon) return;

    button.addEventListener('click', () => {
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      icon.innerHTML = isHidden ? eyeClosedIcon : eyeOpenIcon;
    });
  });
}

function logoutUser() {
  clearCurrentUser();
  window.location.href = 'login.html';
}

function initLogoutButton() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;

  logoutBtn.onclick = logoutUser;
}