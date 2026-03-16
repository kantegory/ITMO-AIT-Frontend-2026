const transactions = [
  { date: '2026-03-10', category: 'Продукты', description: 'Супермаркет', type: 'expense', amount: 3450 },
  { date: '2026-03-09', category: 'Транспорт', description: 'Такси', type: 'expense', amount: 820 },
  { date: '2026-03-08', category: 'Зарплата', description: 'Основной доход', type: 'income', amount: 85000 },
  { date: '2026-03-07', category: 'Развлечения', description: 'Кинотеатр', type: 'expense', amount: 1450 },
  { date: '2026-03-06', category: 'Подписки', description: 'Онлайн-сервис', type: 'expense', amount: 499 },
  { date: '2026-03-05', category: 'Продукты', description: 'Кафе', type: 'expense', amount: 960 }
];

function showToast(message) {
  const toastText = document.getElementById('toastText');
  const toastEl = document.getElementById('liveToast');

  if (!toastText || !toastEl) return;

  toastText.textContent = message;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

function renderTransactions(items = transactions) {
  const tbody = document.getElementById('transactionsBody');
  const emptyState = document.getElementById('transactionsEmpty');

  if (!tbody) return;

  tbody.innerHTML = '';

  if (!items.length) {
    if (emptyState) emptyState.classList.remove('d-none');
    return;
  }

  if (emptyState) emptyState.classList.add('d-none');

  items.forEach(item => {
    const typeText = item.type === 'income' ? 'Доход' : 'Расход';
    const amountClass = item.type === 'income' ? 'text-success' : 'text-danger';
    const amountPrefix = item.type === 'income' ? '+' : '-';

    const row = `
      <tr>
        <td>${item.date}</td>
        <td>${item.category}</td>
        <td>${item.description}</td>
        <td><span class="badge ${item.type === 'income' ? 'text-bg-success' : 'text-bg-light'} rounded-pill">${typeText}</span></td>
        <td class="text-end fw-semibold ${amountClass}">${amountPrefix} ₽ ${item.amount.toLocaleString('ru-RU')}</td>
      </tr>
    `;

    tbody.insertAdjacentHTML('beforeend', row);
  });
}

function filterTransactions() {
  const category = document.getElementById('categoryFilter')?.value.trim() || '';
  const amount = Number(document.getElementById('amountFilter')?.value) || 0;
  const date = document.getElementById('dateFilter')?.value || '';

  let filtered = [...transactions];

  if (category) {
    filtered = filtered.filter(item => item.category === category);
  }

  if (amount) {
    filtered = filtered.filter(item => item.amount >= amount);
  }

  if (date) {
    filtered = filtered.filter(item => item.date === date);
  }

  renderTransactions(filtered);
  showToast('Фильтр применён');
}

function resetFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const amountFilter = document.getElementById('amountFilter');
  const dateFilter = document.getElementById('dateFilter');

  if (categoryFilter) categoryFilter.value = '';
  if (amountFilter) amountFilter.value = '';
  if (dateFilter) dateFilter.value = '';

  renderTransactions(transactions);
  showToast('Фильтры сброшены');
}

function importTransactions() {
  const importStatus = document.getElementById('importStatus');

  if (importStatus) {
    importStatus.classList.remove('d-none');
    importStatus.innerHTML = `
      <strong>Импорт выполнен.</strong><br>
      Загружены демонстрационные транзакции из платёжного аккаунта.
    `;
  }

  showToast('Импорт транзакций выполнен');
}

function addRule() {
  const conditionInput = document.getElementById('ruleCondition');
  const actionInput = document.getElementById('ruleAction');
  const rulesBody = document.getElementById('rulesBody');

  if (!conditionInput || !actionInput || !rulesBody) return;

  const condition = conditionInput.value.trim();
  const action = actionInput.value.trim();

  if (!condition || !action) {
    showToast('Заполните условие и действие');
    return;
  }

  const row = `
    <tr>
      <td>${condition}</td>
      <td>${action}</td>
      <td>Пользовательское</td>
      <td><span class="badge text-bg-success rounded-pill">Активно</span></td>
    </tr>
  `;

  rulesBody.insertAdjacentHTML('beforeend', row);

  const modalEl = document.getElementById('ruleModal');
  const modal = bootstrap.Modal.getInstance(modalEl);

  if (modal) modal.hide();

  conditionInput.value = '';
  actionInput.value = '';

  showToast('Правило добавлено');
}

function initCharts() {
  if (typeof Chart === 'undefined') return;

  const expensesCanvas = document.getElementById('expensesChart');
  const categoryCanvas = document.getElementById('categoryChart');

  if (expensesCanvas) {
    new Chart(expensesCanvas, {
      type: 'line',
      data: {
        labels: ['Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Мар'],
        datasets: [{
          label: 'Расходы',
          data: [42000, 46800, 51000, 49500, 59000, 54320],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.08)',
          fill: true,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }

  if (categoryCanvas) {
    new Chart(categoryCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Продукты', 'Транспорт', 'Развлечения', 'Подписки'],
        datasets: [{
          data: [18500, 5800, 9200, 3200],
          backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

function initPasswordToggle() {
  const passwordInput = document.getElementById('passwordInput');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeIcon = document.getElementById('eyeIcon');

  if (!passwordInput || !togglePasswordBtn || !eyeIcon) return;

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

  togglePasswordBtn.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';

    passwordInput.type = isHidden ? 'text' : 'password';
    eyeIcon.innerHTML = isHidden ? eyeClosedIcon : eyeOpenIcon;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTransactions();
  initCharts();
  initPasswordToggle();
});