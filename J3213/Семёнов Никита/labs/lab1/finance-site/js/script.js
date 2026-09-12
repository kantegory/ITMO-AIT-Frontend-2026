// Базовые транзакции по умолчанию
const DEFAULT_TRANSACTIONS = [
    { id: 1, date: '2026-09-10', name: 'Пятёрочка', category: 'Продукты', amount: -1250 },
    { id: 2, date: '2026-09-09', name: 'Яндекс Go', category: 'Транспорт', amount: -450 },
    { id: 3, date: '2026-09-08', name: 'Аванс', category: 'Зарплата', amount: 35000 },
    { id: 4, date: '2026-09-05', name: 'Ozon', category: 'Покупки', amount: -3200 },
    { id: 5, date: '2026-09-01', name: 'ЖКХ', category: 'Коммунальные услуги', amount: -5400 }
];

document.addEventListener('DOMContentLoaded', () => {
    initAppData();
    checkAuthAndHeader();
    updateBalance(); // Обновляем баланс при загрузке

    // Заполнение даты "сегодня" в форме добавления
    const dateInput = document.getElementById('add-date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Обработка регистрации
    const regForm = document.getElementById('reg-form');
    if (regForm) regForm.addEventListener('submit', handleRegister);

    // Обработка входа
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // Обработка выхода
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Обработка формы "Добавить транзакцию"
    const addTxForm = document.getElementById('add-transaction-form');
    if (addTxForm) addTxForm.addEventListener('submit', handleAddTransaction);

    // Главная страница
    if (document.getElementById('index-transactions-tbody')) {
        renderIndexTable();
        initIndexEvents();
    }

    // Страница транзакций
    if (document.getElementById('transactions-tbody')) {
        renderTransactionsTable();
        initFilterEvents();
    }
});

// Инициализация локального хранилища
function initAppData() {
    if (!localStorage.getItem('app_transactions')) {
        localStorage.setItem('app_transactions', JSON.stringify(DEFAULT_TRANSACTIONS));
    }
    if (!localStorage.getItem('app_users')) {
        const defaultUsers = [{ name: 'Иван Иванов', email: 'ivan@mail.ru', password: '123' }];
        localStorage.setItem('app_users', JSON.stringify(defaultUsers));
    }
}

// Пересчёт и отображение общего баланса
function updateBalance() {
    const balanceEl = document.getElementById('total-balance');
    if (!balanceEl) return;

    const transactions = JSON.parse(localStorage.getItem('app_transactions')) || [];
    
    // Начальная сумма счета до списка базовых операций
    const INITIAL_BASE_BALANCE = 120500; 
    
    // Считаем сумму всех транзакций
    const totalTransactionsSum = transactions.reduce((sum, item) => sum + item.amount, 0);
    const currentTotalBalance = INITIAL_BASE_BALANCE + totalTransactionsSum;

    // Выводим отформатированную сумму
    balanceEl.textContent = `${currentTotalBalance.toLocaleString('ru-RU')} ₽`;
}

function checkAuthAndHeader() {
    const currentUser = JSON.parse(localStorage.getItem('app_current_user'));
    const userDisplay = document.getElementById('user-display-name');
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html');

    if (!currentUser && !isAuthPage) {
        const users = JSON.parse(localStorage.getItem('app_users')) || [];
        if (users.length > 0) {
            localStorage.setItem('app_current_user', JSON.stringify(users[0]));
            if (userDisplay) userDisplay.textContent = users[0].name;
        } else {
            window.location.href = 'login.html';
        }
    } else if (currentUser && userDisplay) {
        userDisplay.textContent = currentUser.name;
    }
}

// Функции Авторизации
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const alertBox = document.getElementById('reg-alert');

    if (password !== confirm) {
        alertBox.textContent = 'Пароли не совпадают!';
        alertBox.classList.remove('d-none');
        return;
    }

    let users = JSON.parse(localStorage.getItem('app_users')) || [];
    if (users.find(u => u.email === email)) {
        alertBox.textContent = 'Пользователь с таким Email уже существует!';
        alertBox.classList.remove('d-none');
        return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('app_users', JSON.stringify(users));
    localStorage.setItem('app_current_user', JSON.stringify(newUser));

    window.location.href = 'index.html';
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const alertBox = document.getElementById('login-alert');

    const users = JSON.parse(localStorage.getItem('app_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('app_current_user', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alertBox.textContent = 'Неверный Email или пароль!';
        alertBox.classList.remove('d-none');
    }
}

function handleLogout() {
    localStorage.removeItem('app_current_user');
    window.location.href = 'login.html';
}

// Добавление новой транзакции (Ручной ввод)
function handleAddTransaction(e) {
    e.preventDefault();
    
    const type = document.getElementById('add-type').value;
    const date = document.getElementById('add-date').value;
    const name = document.getElementById('add-name').value;
    const category = document.getElementById('add-category').value;
    let amount = parseFloat(document.getElementById('add-amount').value);

    // Доход = плюс, Расход = минус
    if (type === 'expense') {
        amount = -Math.abs(amount);
    } else {
        amount = Math.abs(amount);
    }

    const newTx = {
        id: Date.now(),
        date: date,
        name: name,
        category: category,
        amount: amount
    };

    const transactions = JSON.parse(localStorage.getItem('app_transactions')) || [];
    transactions.unshift(newTx);
    localStorage.setItem('app_transactions', JSON.stringify(transactions));

    // Закрываем модальное окно
    const modalEl = document.getElementById('addTransactionModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();
    e.target.reset();

    // Обновляем таблицы и пересчитываем баланс
    if (document.getElementById('index-transactions-tbody')) renderIndexTable();
    if (document.getElementById('transactions-tbody')) renderTransactionsTable();
    updateBalance();

    showAlert('Транзакция успешно добавлена!', 'success');
}

// Главная страница: рендер таблицы
function renderIndexTable() {
    const tbody = document.getElementById('index-transactions-tbody');
    const transactions = JSON.parse(localStorage.getItem('app_transactions')) || [];
    tbody.innerHTML = '';

    transactions.slice(0, 4).forEach(item => {
        const tr = document.createElement('tr');
        const formattedDate = formatDate(item.date);
        const isExpense = item.amount < 0;
        const amountClass = isExpense ? 'text-expense' : 'text-income';
        const sign = isExpense ? '- ' : '+ ';

        tr.innerHTML = `
            <td>${formattedDate}</td>
            <td>${item.name}</td>
            <td><span class="badge bg-secondary">${item.category}</span></td>
            <td class="text-end ${amountClass}">${sign}${Math.abs(item.amount).toLocaleString('ru-RU')} ₽</td>
        `;
        tbody.appendChild(tr);
    });
}

// Главная страница: модальное окно банка и импорт
function initIndexEvents() {
    const connectForm = document.getElementById('connect-bank-form');
    if (connectForm) {
        connectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const bankName = document.getElementById('modal-bank-name').value;
            const cardNum = document.getElementById('modal-card-num').value;

            const list = document.getElementById('connected-accounts-list');
            const newCard = document.createElement('div');
            newCard.className = 'p-2 border rounded d-flex justify-content-between align-items-center mb-2';
            newCard.innerHTML = `<span>${bankName} (*${cardNum})</span><span class="badge bg-success">Подключен</span>`;
            list.appendChild(newCard);

            const modalEl = document.getElementById('connectModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();
            connectForm.reset();

            showAlert('Новый аккаунт успешно подключён!', 'success');
        });
    }

    // Кнопка импорта
    const importBtn = document.getElementById('btn-import-demo');
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            const hasImported = localStorage.getItem('app_has_imported');
            
            if (hasImported) {
                showAlert('Нет новых операций для импорта.', 'warning');
                return;
            }

            const transactions = JSON.parse(localStorage.getItem('app_transactions')) || [];
            const newImports = [
                { id: Date.now() + 1, date: new Date().toISOString().split('T')[0], name: 'Аптека', category: 'Покупки', amount: -850 },
                { id: Date.now() + 2, date: new Date().toISOString().split('T')[0], name: 'Перевод от Петра', category: 'Зарплата', amount: 5000 }
            ];
            
            transactions.unshift(...newImports);
            localStorage.setItem('app_transactions', JSON.stringify(transactions));
            localStorage.setItem('app_has_imported', 'true');
            
            renderIndexTable();
            updateBalance(); // Пересчитываем баланс при импорте
            showAlert('Успешно загружено 2 новые операции из банка!', 'success');
        });
    }
}

// Страница транзакций
function renderTransactionsTable(dataToRender) {
    const tbody = document.getElementById('transactions-tbody');
    const alertBox = document.getElementById('no-data-alert');
    const transactions = dataToRender || JSON.parse(localStorage.getItem('app_transactions')) || [];
    
    tbody.innerHTML = '';

    if (transactions.length === 0) {
        alertBox.classList.remove('d-none');
        return;
    } else {
        alertBox.classList.add('d-none');
    }

    transactions.forEach(item => {
        const tr = document.createElement('tr');
        const formattedDate = formatDate(item.date);
        const isExpense = item.amount < 0;
        const amountClass = isExpense ? 'text-expense' : 'text-income';
        const sign = isExpense ? '- ' : '+ ';

        tr.innerHTML = `
            <td>${formattedDate}</td>
            <td>${item.name}</td>
            <td><span class="badge bg-secondary">${item.category}</span></td>
            <td class="text-end pe-3 ${amountClass}">${sign}${Math.abs(item.amount).toLocaleString('ru-RU')} ₽</td>
        `;
        tbody.appendChild(tr);
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
            renderTransactionsTable();
        });
    }
}

function applyFilters() {
    const search = document.getElementById('filter-search').value.toLowerCase();
    const category = document.getElementById('filter-category').value;
    const min = parseFloat(document.getElementById('filter-min').value);
    const max = parseFloat(document.getElementById('filter-max').value);
    const dateFrom = document.getElementById('filter-date-from').value;
    const dateTo = document.getElementById('filter-date-to').value;

    const transactions = JSON.parse(localStorage.getItem('app_transactions')) || [];

    const filtered = transactions.filter(t => {
        const nameMatch = !search || t.name.toLowerCase().includes(search);
        const catMatch = !category || t.category === category;
        
        const absSum = Math.abs(t.amount);
        const minMatch = isNaN(min) || absSum >= min;
        const maxMatch = isNaN(max) || absSum <= max;

        const dateMatchFrom = !dateFrom || t.date >= dateFrom;
        const dateMatchTo = !dateTo || t.date <= dateTo;

        return nameMatch && catMatch && minMatch && maxMatch && dateMatchFrom && dateMatchTo;
    });

    renderTransactionsTable(filtered);
}

// Вспомогательные функции
function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateStr;
}

function showAlert(message, type = 'success') {
    const container = document.getElementById('alert-container');
    if (!container) return;
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}