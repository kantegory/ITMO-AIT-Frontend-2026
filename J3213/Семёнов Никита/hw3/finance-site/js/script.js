const API_URL = 'http://localhost:3000';
let currentTransactions = [];
let expenseChartInstance = null;

document.addEventListener('DOMContentLoaded', async () => {
    initTheme(); // Запускаем тему самой первой

    const user = checkAuth();

    const regForm = document.getElementById('reg-form');
    if (regForm) regForm.addEventListener('submit', handleRegister);

    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const dateInput = document.getElementById('add-date');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

    const addTxForm = document.getElementById('add-transaction-form');
    if (addTxForm) addTxForm.addEventListener('submit', handleAddTransaction);

    if (user) {
        const nameEl = document.getElementById('user-display-name');
        if (nameEl) nameEl.textContent = user.name;
        
        await fetchUserData(user);

        if (document.getElementById('transactions-tbody')) {
            initFilterEvents();
        }
    }
});

// --- ЛОГИКА ТЕМ (ЛАБА 3) ---
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    
    // Смотрим сохраненную тему или настройки ОС
    const savedTheme = localStorage.getItem('app_theme');
    const osPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const currentTheme = savedTheme || (osPrefersDark ? 'dark' : 'light');
    applyTheme(currentTheme);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
            applyTheme(isDark ? 'light' : 'dark');
        });
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('app_theme', theme);
    
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему');
        
        // Меняем цвет кнопки в зависимости от страницы (светлая/тёмная)
        if (theme === 'dark') {
            toggleBtn.classList.remove('btn-outline-dark');
            toggleBtn.classList.add('btn-outline-light');
        } else {
            // Если мы на странице логина (белый фон), делаем кнопку тёмной
            const isAuth = document.getElementById('login-form') || document.getElementById('reg-form');
            if(isAuth) {
                toggleBtn.classList.remove('btn-outline-light');
                toggleBtn.classList.add('btn-outline-dark');
            }
        }
    }
    
    // Если на странице есть график, обновляем цвет его текста
    if (typeof Chart !== 'undefined' && expenseChartInstance) {
        const textColor = theme === 'dark' ? '#f8f9fa' : '#666';
        expenseChartInstance.options.plugins.legend.labels.color = textColor;
        expenseChartInstance.update();
    }
}
// ----------------------------

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('app_session'));
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html');

    if (!user && !isAuthPage) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const alertBox = document.getElementById('login-alert');

    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('app_session', JSON.stringify(user));
            window.location.href = 'index.html';
        } else {
            alertBox.textContent = 'Неверный Email или пароль!';
            alertBox.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Ошибка API:', error);
        alertBox.textContent = 'Сервер недоступен. Запустите json-server!';
        alertBox.classList.remove('d-none');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const alertBox = document.getElementById('reg-alert');

    if (password !== confirm) {
        alertBox.textContent = 'Пароли не совпадают!';
        alertBox.classList.remove('d-none');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/users`);
        const users = await res.json();
        const existing = users.find(u => u.email === email);

        if (existing) {
            alertBox.textContent = 'Пользователь с таким Email уже существует!';
            alertBox.classList.remove('d-none');
            return;
        }

        const newUser = { name, email, password, baseBalance: 0 };
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        const createdUser = await response.json();
        localStorage.setItem('app_session', JSON.stringify(createdUser));
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        alertBox.textContent = 'Сервер недоступен. Запустите json-server!';
        alertBox.classList.remove('d-none');
    }
}

function handleLogout() {
    localStorage.removeItem('app_session');
    window.location.href = 'login.html';
}

async function fetchUserData(user) {
    try {
        const response = await fetch(`${API_URL}/transactions?userId=${user.id}`);
        currentTransactions = await response.json();
        currentTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        updateBalance(user.baseBalance, currentTransactions);

        if (document.getElementById('index-transactions-tbody')) {
            renderTable('index-transactions-tbody', currentTransactions.slice(0, 4));
        }
        if (document.getElementById('transactions-tbody')) {
            renderTable('transactions-tbody', currentTransactions);
        }
        
        if (document.getElementById('expenseChart')) {
            renderChart(currentTransactions);
        }
    } catch (error) {
        showAlert('Ошибка подключения к API серверу.', 'danger');
    }
}

async function handleAddTransaction(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('app_session'));

    let amount = parseFloat(document.getElementById('add-amount').value);
    if (document.getElementById('add-type').value === 'expense') {
        amount = -Math.abs(amount);
    } else {
        amount = Math.abs(amount);
    }

    const newTx = {
        userId: user.id,
        date: document.getElementById('add-date').value,
        name: document.getElementById('add-name').value,
        category: document.getElementById('add-category').value,
        amount: amount
    };

    try {
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTx)
        });

        if (response.ok) {
            const modalEl = document.getElementById('addTransactionModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) modalInstance.hide();
            
            e.target.reset();
            const dateInput = document.getElementById('add-date');
            if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

            await fetchUserData(user);
            showAlert('Транзакция успешно добавлена!', 'success');
        }
    } catch (error) {
        showAlert('Ошибка отправки данных', 'danger');
    }
}

function updateBalance(baseBalance, transactions) {
    const balanceEl = document.getElementById('total-balance');
    if (!balanceEl) return;
    const totalSum = transactions.reduce((sum, item) => sum + item.amount, 0);
    balanceEl.textContent = `${((baseBalance || 0) + totalSum).toLocaleString('ru-RU')} ₽`;
}

function renderTable(tbodyId, data) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted p-3">Операций пока нет</td></tr>';
        return;
    }

    data.forEach(item => {
        const isExpense = item.amount < 0;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatDate(item.date)}</td>
            <td>${item.name}</td>
            <td><span class="badge bg-secondary">${item.category}</span></td>
            <td class="text-end fw-bold ${isExpense ? 'text-expense' : 'text-income'}">
                ${isExpense ? '' : '+'}${item.amount.toLocaleString('ru-RU')} ₽
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderChart(transactions) {
    const ctx = document.getElementById('expenseChart');
    if (!ctx) return;

    const expenses = transactions.filter(t => t.amount < 0);
    const categories = {};
    expenses.forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
    });

    if (expenseChartInstance) {
        expenseChartInstance.destroy();
    }

    // Текущий цвет текста в зависимости от темы
    const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    const textColor = isDark ? '#f8f9fa' : '#666';

    expenseChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#0d6efd', '#6f42c1'],
                borderWidth: 2,
                borderColor: isDark ? '#212529' : '#fff',
                hoverOffset: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: { color: textColor }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) { return ` ${context.label}: ${context.raw.toLocaleString('ru-RU')} ₽`; }
                    }
                }
            }
        }
    });
}

function initFilterEvents() {
    const filterForm = document.getElementById('filter-form');
    const resetBtn = document.getElementById('btn-reset-filters');

    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            applyFilters();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            filterForm.reset();
            renderTable('transactions-tbody', currentTransactions);
        });
    }
}

function applyFilters() {
    const search = document.getElementById('filter-search').value.toLowerCase();
    const category = document.getElementById('filter-category').value;
    const min = parseFloat(document.getElementById('filter-min').value);
    const max = parseFloat(document.getElementById('filter-max').value);

    const filtered = currentTransactions.filter(t => {
        const nameMatch = !search || t.name.toLowerCase().includes(search);
        const catMatch = !category || t.category === category;
        const absSum = Math.abs(t.amount);
        const minMatch = isNaN(min) || absSum >= min;
        const maxMatch = isNaN(max) || absSum <= max;
        return nameMatch && catMatch && minMatch && maxMatch;
    });

    renderTable('transactions-tbody', filtered);
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const p = dateStr.split('-');
    return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : dateStr;
}

function showAlert(message, type = 'success') {
    const container = document.getElementById('alert-container');
    if (!container) return;
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>
        </div>
    `;
}