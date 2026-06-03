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

async function handleRegister(e) {
    e.preventDefault();
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
            alert(`Ошибка регистрации сервера!\nСтатус: ${response.status}\nТекст: ${err}`);
        }
    } catch (error) {
        alert('Сервер недоступен! ' + error.message);
    }
}

async function handleLogin(e) {
    e.preventDefault();
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
            alert('Неверный Email или пароль');
        }
    } catch (error) {
        alert('Сервер недоступен! ' + error.message);
    }
}

async function loadAccounts() {
    const container = document.getElementById('accountsContainer');
    if (!container) return;

    const accountsData = [
        { name: "Зарплатная карта", type: "primary", balance: 0 },
        { name: "Наличные", type: "success", balance: 0 },
        { name: "Кредитная карта", type: "credit", balance: 0 }
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
                    if (t.transType === 'expense') {
                        acc.balance -= parseFloat(t.amount); 
                    } else {
                        acc.balance += parseFloat(t.amount); 
                    }
                }
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки истории, показываем нулевые счета:', error);
    }

    container.innerHTML = '';
    accountsData.forEach(acc => {
        const balanceSign = acc.balance < 0 ? '- ' : '';
        container.innerHTML += `
            <article class="col-md-4 mb-3">
                <div class="card account-card account-card--${acc.type} h-100 shadow">
                    <div class="card-body p-4 d-flex flex-column justify-content-between">
                        <p class="account-card__label">${acc.name}</p>
                        <h3 class="fw-bold mb-0">${balanceSign}${Math.abs(acc.balance).toLocaleString('ru-RU')} ₽</h3>
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
        console.error('Failed to load transactions:', error);
    }
}

function renderTransactions(transactions) {
    const tableBody = document.getElementById('transactionsTable');
    if(!tableBody) return;
    tableBody.innerHTML = '';

    const categoriesMap = {
        food: 'Еда / Супермаркеты',
        transport: 'Транспорт',
        income: 'Поступления / Зарплата',
        transfers: 'Переводы'
    };

    transactions.forEach(t => {
        const isExp = t.transType === 'expense';
        const color = isExp ? 'text-danger' : 'text-success';
        const sign = isExp ? '- ' : '+ ';

        tableBody.innerHTML += `
            <tr data-category="${t.category}" data-account="${t.accountName}">
                <td class="px-4">${t.date}</td>
                <td>${t.accountName}</td>
                <td class="fw-bold">${t.description}</td>
                <td>${categoriesMap[t.category] || t.category}</td>
                <td class="${color}">${sign}${parseFloat(t.amount).toLocaleString('ru-RU')} ₽</td>
            </tr>
        `;
    });
}

function filterTransactions() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filterCategory = document.getElementById('categoryFilter').value;
    const filterAccount = document.getElementById('accountFilter').value;

    if (!window.allTransactions) return;

    const filtered = window.allTransactions.filter(t => {
        const textMatches = t.description.toLowerCase().includes(searchText);
        const categoryMatches = (filterCategory === 'all' || filterCategory === t.category);
        const accountMatches = (filterAccount === 'all' || t.accountName.includes(filterAccount));

        return textMatches && categoryMatches && accountMatches;
    });

    renderTransactions(filtered);
}


async function handleAddTransaction(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    data.userId = getUser().id;
    data.amount = parseFloat(data.amount);
    data.date = new Date().toLocaleDateString('ru-RU');

    try {
        const response = await fetch(`${API_URL}/600/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const modalElement = document.getElementById('addTransactionModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if(modalInstance) modalInstance.hide();
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

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);

    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const transactionForm = document.getElementById('transactionForm');
    if (transactionForm) transactionForm.addEventListener('submit', handleAddTransaction);

    loadAccounts();
    loadTransactions();
});

