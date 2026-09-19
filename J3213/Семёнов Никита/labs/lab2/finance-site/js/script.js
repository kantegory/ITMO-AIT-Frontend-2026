const API_URL = 'http://127.0.0.1:3000';
let currentTransactions = [];
let expenseChartInstance = null;

function getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

document.addEventListener('DOMContentLoaded', async () => {
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

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('app_session') || 'null');
    const token = localStorage.getItem('accessToken');
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html');

    if ((!user || !token) && !isAuthPage) {
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

    if (!email || !password) {
        alertBox.textContent = 'Введите email и пароль.';
        alertBox.classList.remove('d-none');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            const message = typeof data === 'string' ? data : (data?.message || 'Неверный Email или пароль!');
            throw new Error(message);
        }

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('app_session', JSON.stringify(data.user || { email }));
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Ошибка API:', error);
        alertBox.textContent = error.message || 'Сервер недоступен. Запустите json-server-auth!';
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

    if (!name || !email || !password) {
        alertBox.textContent = 'Заполните все поля.';
        alertBox.classList.remove('d-none');
        return;
    }

    if (password.length < 6) {
        alertBox.textContent = 'Пароль должен содержать минимум 6 символов.';
        alertBox.classList.remove('d-none');
        return;
    }

    if (password !== confirm) {
        alertBox.textContent = 'Пароли не совпадают!';
        alertBox.classList.remove('d-none');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, baseBalance: 0 })
        });

        const data = await response.json();

        if (!response.ok) {
            const message = typeof data === 'string' ? data : (data?.message || 'Ошибка регистрации');
            throw new Error(message);
        }

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('app_session', JSON.stringify(data.user || { name, email }));
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        alertBox.textContent = error.message || 'Сервер недоступен. Запустите json-server-auth!';
        alertBox.classList.remove('d-none');
    }
}

function handleLogout() {
    localStorage.removeItem('app_session');
    localStorage.removeItem('accessToken');
    window.location.href = 'login.html';
}

async function fetchUserData(user) {
    try {
        const response = await fetch(`${API_URL}/600/transactions?userId=${user.id}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(text || 'Ошибка авторизации');
        }

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
        console.error('Ошибка загрузки данных:', error);
        showAlert(error.message || 'Ошибка подключения к API серверу. Убедитесь, что json-server запущен.', 'danger');
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
        const response = await fetch(`${API_URL}/600/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
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
            showAlert('Транзакция успешно добавлена на сервер!', 'success');
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
            <td class="text-end ${isExpense ? 'text-expense' : 'text-income'}">
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

    expenseChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    '#dc3545',
                    '#fd7e14',
                    '#ffc107',
                    '#20c997',
                    '#0d6efd',
                    '#6f42c1'
                ],
                borderWidth: 2,
                hoverOffset: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.label}: ${context.raw.toLocaleString('ru-RU')} ₽`;
                        }
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
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть уведомление"></button>
        </div>
    `;
}