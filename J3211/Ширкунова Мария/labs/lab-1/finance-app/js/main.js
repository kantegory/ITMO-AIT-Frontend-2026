const API_URL = 'http://localhost:3000';

function getToken() {
    return localStorage.getItem('accessToken');
}

function getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

function checkAuth() {
    const token = getToken();
    const currentPage = window.location.pathname;
    const isAuthPage = currentPage.includes('login.html') || currentPage.includes('register.html');

    if (!token && !isAuthPage) {
        window.location.href = 'login.html';
    } else if (token && isAuthPage) {
        window.location.href = 'index.html';
    }
}

function showError(containerId, message) {
    const el = document.getElementById(containerId);
    if (!el) {
        alert(message);
        return;
    }
    el.textContent = message;
    el.classList.remove('d-none');
    el.focus();
}

function hideError(containerId) {
    const el = document.getElementById(containerId);
    if (el) {
        el.textContent = '';
        el.classList.add('d-none');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    hideError('registerError');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('user', JSON.stringify(result.user));

            const toast = new bootstrap.Toast(document.getElementById('registerToast'));
            toast.show();
            setTimeout(() => window.location.href = 'index.html', 1500);
        } else {
            const err = await response.text();
            showError('registerError', `Ошибка регистрации (${response.status}): ${err}`);
        }
    } catch (error) {
        showError('registerError', 'Сервер недоступен: ' + error.message);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    hideError('loginError');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('user', JSON.stringify(result.user));
            window.location.href = 'index.html';
        } else {
            showError('loginError', 'Неверный Email или пароль');
        }
    } catch (error) {
        showError('loginError', 'Сервер недоступен: ' + error.message);
    }
}

async function loadAccounts() {
    const container = document.getElementById('accountsContainer');
    if (!container) return;

    const accountsData = [
        { name: 'Зарплатная карта', type: 'primary', balance: 0 },
        { name: 'Наличные',         type: 'success', balance: 0 },
        { name: 'Кредитная карта',  type: 'credit',  balance: 0 }
    ];

    try {
        const userId = getUser().id;
        const response = await fetch(`${API_URL}/600/transactions?userId=${userId}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        if (response.ok) {
            const transactions = await response.json();
            transactions.forEach(t => {
                const acc = accountsData.find(a => a.name === t.accountName);
                if (acc) {
                    acc.balance += t.transType === 'expense'
                        ? -parseFloat(t.amount)
                        :  parseFloat(t.amount);
                }
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки транзакций для счетов:', error);
    }

    container.innerHTML = '';
    accountsData.forEach(acc => {
        const balanceSign = acc.balance < 0 ? '− ' : '';
        const formattedBalance = Math.abs(acc.balance).toLocaleString('ru-RU');

        container.innerHTML += `
            <article class="col-md-4 mb-3">
                <div class="card account-card account-card--${acc.type} h-100 shadow"
                     role="region"
                     aria-label="Счёт: ${acc.name}">
                    <div class="card-body p-4 d-flex flex-column justify-content-between">
                        <p class="account-card__label">${acc.name}</p>
                        <h3 class="fw-bold mb-0" aria-label="Баланс ${balanceSign}${formattedBalance} рублей">
                            ${balanceSign}${formattedBalance} ₽
                        </h3>
                    </div>
                </div>
            </article>
        `;
    });
}

async function loadTransactions() {
    const tableBody = document.getElementById('transactionsTable');
    if (!tableBody) return;

    try {
        const userId = getUser().id;
        const response = await fetch(`${API_URL}/600/transactions?userId=${userId}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const transactions = await response.json();

        window.allTransactions = transactions;
        renderTransactions(transactions);
    } catch (error) {
        console.error('Не удалось загрузить транзакции:', error);
    }
}

function renderTransactions(transactions) {
    const tableBody = document.getElementById('transactionsTable');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const categoriesMap = {
        food:      'Еда / Супермаркеты',
        transport: 'Транспорт',
        income:    'Поступления / Зарплата',
        transfers: 'Переводы'
    };

    if (transactions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">Транзакций не найдено</td>
            </tr>`;
        return;
    }

    transactions.forEach(t => {
        const isExp = t.transType === 'expense';
        const color = isExp ? 'text-danger' : 'text-success';
        const sign  = isExp ? '− ' : '+ ';
        const srType = isExp ? 'Расход' : 'Доход';

        tableBody.innerHTML += `
            <tr>
                <td class="px-4">${t.date}</td>
                <td>${t.accountName}</td>
                <td class="fw-bold">${t.description}</td>
                <td>${categoriesMap[t.category] || t.category}</td>
                <td class="${color}">
                    <span class="visually-hidden">${srType}</span>
                    ${sign}${parseFloat(t.amount).toLocaleString('ru-RU')} ₽
                </td>
            </tr>
        `;
    });
}

function filterTransactions() {
    const searchText    = document.getElementById('searchInput').value.toLowerCase();
    const filterCategory = document.getElementById('categoryFilter').value;
    const filterAccount  = document.getElementById('accountFilter').value;

    if (!window.allTransactions) return;

    const filtered = window.allTransactions.filter(t => {
        const textMatches     = t.description.toLowerCase().includes(searchText);
        const categoryMatches = filterCategory === 'all' || filterCategory === t.category;
        const accountMatches  = filterAccount === 'all'  || t.accountName.includes(filterAccount);
        return textMatches && categoryMatches && accountMatches;
    });

    renderTransactions(filtered);

    announceToSR(`Найдено транзакций: ${filtered.length}`);
}

async function handleAddTransaction(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    data.userId = getUser().id;
    data.amount = parseFloat(data.amount);
    data.date   = new Date().toLocaleDateString('ru-RU');

    try {
        const response = await fetch(`${API_URL}/600/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const modalElement = document.getElementById('addTransactionModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();
            e.target.reset();

            const toast = new bootstrap.Toast(document.getElementById('successToast'));
            toast.show();

            loadTransactions();
            loadAccounts();
        }
    } catch (error) {
        alert('Ошибка при добавлении: ' + error.message);
    }
}

function announceToSR(message) {
    let announcer = document.getElementById('sr-announcer');
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'sr-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.classList.add('visually-hidden');
        document.body.appendChild(announcer);
    }
    announcer.textContent = '';
    setTimeout(() => { announcer.textContent = message; }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const registerForm    = document.getElementById('registerForm');
    const loginForm       = document.getElementById('loginForm');
    const transactionForm = document.getElementById('transactionForm');

    if (registerForm)    registerForm.addEventListener('submit', handleRegister);
    if (loginForm)       loginForm.addEventListener('submit', handleLogin);
    if (transactionForm) transactionForm.addEventListener('submit', handleAddTransaction);

    loadAccounts();
    loadTransactions();
});

