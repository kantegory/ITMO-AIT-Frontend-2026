// ЛР2 — пример связывания страниц с мок-API.
// Подключается как модуль: <script type="module" src="js/main.js"></script>
import { api } from './api.js';
import { login, register, logout, requireAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page; // задайте data-page у <body> каждой страницы

  if (page === 'login') initLogin();
  if (page === 'register') initRegister();
  if (page === 'search') initSearch();
  if (page === 'dashboard') initDashboard();
});

// --- Вход ---
function initLogin() {
  const form = document.querySelector('form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await login({
        email: form.querySelector('#email').value,
        password: form.querySelector('#password').value,
      });
      window.location.href = 'dashboard.html';
    } catch (err) {
      alert(err.message);
    }
  });
}

// --- Регистрация ---
function initRegister() {
  const form = document.querySelector('form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await register({
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        password: form.querySelector('#password').value,
      });
      window.location.href = 'dashboard.html';
    } catch (err) {
      alert(err.message);
    }
  });
}

// --- Поиск/фильтрация транзакций ---
async function initSearch() {
  requireAuth();
  const tbody = document.querySelector('#tx-list');
  try {
    const [transactions, categories] = await Promise.all([
      api.getTransactions('?_sort=date&_order=desc'),
      api.getCategories(),
    ]);
    const catName = (id) => categories.find((c) => c.id === id)?.name ?? '—';
    tbody.innerHTML = transactions.map((t) => `
      <tr>
        <td>${t.date}</td>
        <td>${catName(t.categoryId)}</td>
        <td>${t.description}</td>
        <td>${t.type === 'income' ? 'Доход' : 'Расход'}</td>
        <td class="text-end ${t.type === 'income' ? 'amount-income' : 'amount-expense'}">
          ${t.type === 'income' ? '+' : '−'}${t.amount} ₽
        </td>
      </tr>`).join('');
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="5" class="text-danger">Ошибка загрузки: ${err.message}</td></tr>`;
  }
  // TODO: повесить отправку формы #filters и формировать query-строку из полей.
}

// --- Кабинет ---
async function initDashboard() {
  requireAuth();
  // TODO: загрузить счета (api.getAccounts), бюджеты (api.getBudgets),
  // последние транзакции и отрисовать их вместо статичных данных.
}

window.logout = logout; // чтобы повесить на кнопку "Выйти"
