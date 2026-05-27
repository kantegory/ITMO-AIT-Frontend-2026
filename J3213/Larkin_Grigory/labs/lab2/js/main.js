var savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-bs-theme', savedTheme);

function updateToggleLabel() {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'Светлая' : 'Тёмная';
}

document.addEventListener('DOMContentLoaded', function () {
  updateToggleLabel();

  var toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-bs-theme', next);
      localStorage.setItem('theme', next);
      updateToggleLabel();
    });
  }

  var logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      logout();
    });
  }
});

var CATEGORY_LABELS = {
  income: 'Доход',
  food: 'Еда',
  housing: 'Жильё',
  transport: 'Транспорт',
  entertainment: 'Развлечения',
  services: 'Сервисы'
};

var CATEGORY_BADGES = {
  income: 'bg-success',
  food: 'bg-warning text-dark',
  housing: 'bg-secondary',
  transport: 'bg-primary',
  entertainment: 'bg-info',
  services: 'bg-info'
};

function formatAmount(amount) {
  var sign = amount >= 0 ? '+' : '−';
  return sign + ' ' + Math.abs(amount).toLocaleString('ru-RU') + ' ₽';
}

function formatDate(dateStr) {
  var parts = dateStr.split('-');
  return parts[2] + '.' + parts[1] + '.' + parts[0];
}

function showError(container, message) {
  container.innerHTML = '<div class="alert alert-danger">' + message + '</div>';
}
