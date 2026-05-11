const API_BASE_URL = 'http://localhost:3000';
const THEME_STORAGE_KEY = 'finance-manager-theme-v9';
const DATA_STORAGE_KEY = 'finance-manager-demo-data-v2';
const SESSION_STORAGE_KEY = 'finance-manager-session-v2';
const EXPENSE_CATEGORIES = ['Продукты', 'Транспорт', 'Развлечения', 'Коммунальные', 'Здоровье', 'Сбережения'];
const INCOME_CATEGORIES = ['Работа', 'Фриланс', 'Подарок', 'Возврат', 'Перевод'];

const DEMO_DATA = {
    users: [
        { id: 1, name: 'Лев', email: 'admin', password: 'admin', currency: 'RUB' },
    ],
    accounts: [
        { id: 1, userId: 1, name: 'Основной счёт', type: 'Дебетовая карта', balance: 92140.34, currency: 'RUB' },
        { id: 2, userId: 1, name: 'Накопления', type: 'Сберегательный счёт', balance: 180500.00, currency: 'RUB' },
        { id: 3, userId: 1, name: 'Наличные', type: 'Кошелёк', balance: 5600.00, currency: 'RUB' },
    ],
    budgets: [
        { id: 1, userId: 1, category: 'Продукты', limit: 25000, spent: 18340 },
        { id: 2, userId: 1, category: 'Транспорт', limit: 7000, spent: 4120 },
        { id: 3, userId: 1, category: 'Развлечения', limit: 12000, spent: 9650 },
        { id: 4, userId: 1, category: 'Коммунальные', limit: 9000, spent: 7640 },
    ],
    transactions: [
        { id: 1, userId: 1, date: '2026-03-01', description: 'Зарплата за февраль', category: 'Работа', account: 'Основной счёт', type: 'income', amount: 120000 },
        { id: 2, userId: 1, date: '2026-03-02', description: 'Супермаркет', category: 'Продукты', account: 'Основной счёт', type: 'expense', amount: 3450.60 },
        { id: 3, userId: 1, date: '2026-03-03', description: 'Метро и автобус', category: 'Транспорт', account: 'Основной счёт', type: 'expense', amount: 280 },
        { id: 4, userId: 1, date: '2026-03-04', description: 'Кафе с друзьями', category: 'Развлечения', account: 'Основной счёт', type: 'expense', amount: 1760 },
        { id: 5, userId: 1, date: '2026-03-05', description: 'Коммунальные услуги', category: 'Коммунальные', account: 'Основной счёт', type: 'expense', amount: 5200 },
        { id: 6, userId: 1, date: '2026-03-06', description: 'Фриланс проект', category: 'Фриланс', account: 'Основной счёт', type: 'income', amount: 15000 },
        { id: 7, userId: 1, date: '2026-03-07', description: 'Кино и кофе', category: 'Развлечения', account: 'Основной счёт', type: 'expense', amount: 1240 },
        { id: 8, userId: 1, date: '2026-03-08', description: 'Аптека', category: 'Здоровье', account: 'Основной счёт', type: 'expense', amount: 890 },
        { id: 9, userId: 1, date: '2026-03-09', description: 'Перевод в накопления', category: 'Сбережения', account: 'Накопления', type: 'expense', amount: 10000 },
        { id: 10, userId: 1, date: '2026-03-10', description: 'Подарок от семьи', category: 'Подарок', account: 'Наличные', type: 'income', amount: 2000 },
        { id: 11, userId: 1, date: '2026-03-12', description: 'Супермаркет', category: 'Продукты', account: 'Основной счёт', type: 'expense', amount: 5210.15 },
        { id: 12, userId: 1, date: '2026-03-14', description: 'Такси', category: 'Транспорт', account: 'Основной счёт', type: 'expense', amount: 780 },
    ],
};

function formatMoney(value, currency = 'RUB') {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(value || 0));
}

function formatDate(dateString) {
    return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateString));
}

function getMonthKey(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonthLabel(monthKey, options = {}) {
    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    const formatterOptions = options.short
        ? { month: 'short' }
        : { month: 'long', year: 'numeric' };
    const label = new Intl.DateTimeFormat('ru-RU', formatterOptions).format(date);
    return label.charAt(0).toUpperCase() + label.slice(1);
}


function formatPlainNumber(value) {
    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Number(value || 0));
}

function applyRingChart(element, value, options = {}) {
    if (!element) return;
    const main = options.main || 'var(--primary)';
    const secondary = options.secondary || 'var(--accent)';
    const track = options.track || 'var(--ring-track)';
    const parts = Array.isArray(options.parts) && options.parts.length ? options.parts : [value];
    let start = 0;
    const segments = parts.map((part, index) => {
        const safe = Math.max(0, Math.min(100, Number(part) || 0));
        const end = start + safe;
        const color = index === 0 ? main : index === 1 ? secondary : track;
        const seg = `${color} ${start}% ${end}%`;
        start = end;
        return seg;
    });
    if (start < 100) segments.push(`${track} ${start}% 100%`);
    element.style.background = `conic-gradient(${segments.join(', ')})`;
    if (options.centerText) {
        const span = element.querySelector('span');
        if (span) span.textContent = options.centerText;
    }
}

function renderBudgetPulse(transactions, targetLines, targetRing, targetRingValue, monthKey) {
    if (!targetLines || !targetRing || !monthKey) return;

    const categoryList = document.getElementById('budget-pulse-category-list');
    const monthLabelShort = formatMonthLabel(monthKey, { short: true });
    const expenseTransactions = transactions.filter((item) => item.type === 'expense' && getMonthKey(item.date) === monthKey);
    const groupedAll = Object.entries(groupBy(expenseTransactions, 'category')).map(([category, items]) => ({
        category,
        total: items.reduce((sum, item) => sum + Number(item.amount), 0),
    })).sort((a, b) => b.total - a.total);

    const totalExpense = groupedAll.reduce((sum, item) => sum + item.total, 0);
    const grouped = groupedAll.slice(0, 3);
    const items = grouped.map((item) => ({
        category: item.category,
        total: item.total,
        share: totalExpense ? Math.round((item.total / totalExpense) * 100) : 0,
    }));

    targetLines.innerHTML = items.length ? items.map((item) => `
        <div class="chart-line"><span>${item.category}</span><b style="--value:${item.share}%"></b><strong>${item.share}%</strong></div>
    `).join('') : '<div class="empty-state">В выбранном месяце пока нет расходных операций.</div>';

    applyRingChart(targetRing, 100, {
        parts: items.map((item) => item.share),
        centerText: formatMonthLabel(monthKey, { short: true }) + ' ' + monthKey.slice(0, 4),
    });
    if (targetRingValue) targetRingValue.textContent = formatMonthLabel(monthKey, { short: true }) + ' ' + monthKey.slice(0, 4);

    if (categoryList) {
        categoryList.innerHTML = items.length ? items.map((item) => `
            <div class="summary-item summary-item--category">
                <span>${item.category}</span>
                <strong>${item.share}%</strong>
            </div>
        `).join('') : `
            <div class="summary-item summary-item--category">
                <span>Нет расходов за месяц</span>
                <strong>—</strong>
            </div>
        `;
    }
}


function getStoredFallbackData() {
    const raw = localStorage.getItem(DATA_STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(DEMO_DATA));
        return structuredClone(DEMO_DATA);
    }

    try {
        return JSON.parse(raw);
    } catch {
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(DEMO_DATA));
        return structuredClone(DEMO_DATA);
    }
}

function saveStoredFallbackData(data) {
    localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
}

async function apiGet(resource, query = '') {
    const url = `${API_BASE_URL}/${resource}${query ? `?${query}` : ''}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch {
        const data = getStoredFallbackData()[resource] ?? [];
        if (!query) return data;
        const params = new URLSearchParams(query);
        return data.filter((item) => {
            return [...params.entries()].every(([key, value]) => String(item[key]) === value);
        });
    }
}

async function apiPost(resource, payload) {
    try {
        const response = await fetch(`${API_BASE_URL}/${resource}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch {
        const data = getStoredFallbackData();
        const resourceData = data[resource] || [];
        const nextId = resourceData.length ? Math.max(...resourceData.map((item) => Number(item.id))) + 1 : 1;
        const record = { id: nextId, ...payload };
        resourceData.push(record);
        data[resource] = resourceData;
        saveStoredFallbackData(data);
        return record;
    }
}

async function apiSeedUserData(user) {
    const currency = user.currency || 'RUB';
    const accounts = [
        { userId: user.id, name: 'Основной счёт', type: 'Дебетовая карта', balance: 50000, currency },
        { userId: user.id, name: 'Накопления', type: 'Сберегательный счёт', balance: 15000, currency },
        { userId: user.id, name: 'Наличные', type: 'Кошелёк', balance: 3200, currency },
    ];

    const budgets = [
        { userId: user.id, category: 'Продукты', limit: 15000, spent: 3400 },
        { userId: user.id, category: 'Транспорт', limit: 5000, spent: 840 },
        { userId: user.id, category: 'Развлечения', limit: 8000, spent: 1250 },
    ];

    const transactions = [
        { userId: user.id, date: '2026-03-01', description: 'Первое пополнение', category: 'Работа', account: 'Основной счёт', type: 'income', amount: 50000 },
        { userId: user.id, date: '2026-03-02', description: 'Покупка продуктов', category: 'Продукты', account: 'Основной счёт', type: 'expense', amount: 1850 },
        { userId: user.id, date: '2026-03-03', description: 'Такси', category: 'Транспорт', account: 'Основной счёт', type: 'expense', amount: 420 },
        { userId: user.id, date: '2026-03-04', description: 'Перевод в накопления', category: 'Сбережения', account: 'Накопления', type: 'expense', amount: 7000 },
    ];

    for (const account of accounts) {
        await apiPost('accounts', account);
    }

    for (const budget of budgets) {
        await apiPost('budgets', budget);
    }

    for (const transaction of transactions) {
        await apiPost('transactions', transaction);
    }
}

function setSession(user) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency || 'RUB',
    }));
}

function getSession() {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function clearSession() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
}

function requiresAuth(pageName) {
    return ['dashboard', 'transactions', 'report'].includes(pageName);
}


function getPagePrefix() {
    return window.location.pathname.includes('/pages/') ? '' : 'pages/';
}

function redirectTo(url) {
    const normalized = url.startsWith('http') ? url : `${getPagePrefix()}${url}`;
    window.location.href = normalized;
}

function getIconSpritePrefix() {
    return window.location.pathname.includes('/pages/') ? '../assets/icons/sprite.svg' : 'assets/icons/sprite.svg';
}

function syncThemeButtons() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme') || 'light';
    const themeLabel = currentTheme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
    const themeGlyph = currentTheme === 'dark' ? '☀' : '☾';

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        const glyph = button.querySelector('.theme-glyph');
        if (glyph) {
            glyph.textContent = themeGlyph;
        }
        button.setAttribute('aria-label', themeLabel);
        button.setAttribute('title', themeLabel);
    });
}

function setupTheme() {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    root.setAttribute('data-theme', savedTheme);
    syncThemeButtons();

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        if (button.dataset.themeBound === 'true') return;
        button.dataset.themeBound = 'true';

        button.addEventListener('click', () => {
            const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', nextTheme);
            localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
            syncThemeButtons();
        });
    });
}

function setupAuthState(pageName) {
    const session = getSession();
    if (requiresAuth(pageName) && !session) {
        redirectTo('login.html');
        return null;
    }
    return session;
}

function updateNavigation() {
    const session = getSession();
    const links = document.querySelectorAll('.navbar .btn, .navbar .nav-link');
    const protectedLinks = [...document.querySelectorAll('.navbar .nav-link')]
        .filter((node) => /(dashboard|transactions|report)\.html$/.test(node.getAttribute('href') || ''));

    if (!session) {
        protectedLinks.forEach((node) => node.closest('.nav-item')?.classList.add('d-none'));
        return;
    }

    protectedLinks.forEach((node) => node.closest('.nav-item')?.classList.remove('d-none'));

    const loginBtn = [...links].find((node) => node.getAttribute('href')?.includes('login'));
    const registerBtn = [...links].find((node) => node.getAttribute('href')?.includes('register'));

    if (loginBtn) {
        loginBtn.textContent = session.name;
        loginBtn.setAttribute('href', `${getPagePrefix()}dashboard.html`);
    }

    if (registerBtn) {
        registerBtn.textContent = 'Выйти';
        registerBtn.removeAttribute('href');

        if (registerBtn.dataset.logoutBound !== 'true') {
            registerBtn.dataset.logoutBound = 'true';
            registerBtn.addEventListener('click', (event) => {
                event.preventDefault();
                clearSession();
                redirectTo('login.html');
            });
        }
    }
}

function showStatus(message, isError = false) {
    const status = document.getElementById('form-status');
    if (!status) return;
    status.textContent = message;
    status.style.color = isError ? 'var(--danger)' : 'var(--success)';
}

function normalizePathLink(fileName) {
    return fileName;
}

async function initLoginPage() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const email = formData.get('email')?.toString().trim().toLowerCase();
        const password = formData.get('password')?.toString();

        if (!email || !password) {
            showStatus('Заполните логин и пароль.', true);
            return;
        }

        const users = await apiGet('users');
        const user = users.find((item) => item.email.toLowerCase() === email && item.password === password);

        if (!user) {
            showStatus('Неверная почта или пароль.', true);
            return;
        }

        setSession(user);
        showStatus('Вход выполнен успешно. Переход в личный кабинет...');
        setTimeout(() => redirectTo('dashboard.html'), 500);
    });
}

async function initRegisterPage() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const payload = {
            name: formData.get('name')?.toString().trim(),
            email: formData.get('email')?.toString().trim().toLowerCase(),
            password: formData.get('password')?.toString(),
            currency: formData.get('currency')?.toString(),
        };

        const agreement = document.getElementById('register-agreement');

        if (!payload.name || !payload.email || !payload.password || !agreement?.checked) {
            showStatus('Заполните все обязательные поля и подтвердите согласие.', true);
            return;
        }

        const users = await apiGet('users');
        if (users.some((user) => user.email.toLowerCase() === payload.email)) {
            showStatus('Пользователь с такой почтой уже существует.', true);
            return;
        }

        const createdUser = await apiPost('users', payload);
        await apiSeedUserData(createdUser);
        setSession(createdUser);
        showStatus('Регистрация завершена. Сейчас откроется личный кабинет.');
        setTimeout(() => redirectTo('dashboard.html'), 600);
    });
}

function groupBy(array, key) {
    return array.reduce((acc, item) => {
        const group = item[key];
        acc[group] = acc[group] || [];
        acc[group].push(item);
        return acc;
    }, {});
}

async function fetchUserData(session) {
    const [accounts, budgets, transactions] = await Promise.all([
        apiGet('accounts'),
        apiGet('budgets'),
        apiGet('transactions'),
    ]);

    return {
        accounts: accounts.filter((item) => Number(item.userId) === Number(session.id)),
        budgets: budgets.filter((item) => Number(item.userId) === Number(session.id)),
        transactions: transactions
            .filter((item) => Number(item.userId) === Number(session.id))
            .sort((a, b) => new Date(b.date) - new Date(a.date)),
    };
}

async function initDashboardPage(session) {
    if (!session) return;
    const { accounts, budgets, transactions } = await fetchUserData(session);

    const income = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + Number(item.amount), 0);
    const expense = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + Number(item.amount), 0);
    const net = income - expense;

    const statIncome = document.querySelector('[data-stat="income"]');
    const statExpense = document.querySelector('[data-stat="expense"]');
    const statNet = document.querySelector('[data-stat="net"]');

    if (statIncome) statIncome.textContent = formatMoney(income, session.currency);
    if (statExpense) statExpense.textContent = formatMoney(expense, session.currency);
    if (statNet) statNet.textContent = formatMoney(net, session.currency);

    const accountsList = document.getElementById('accounts-list');
    const accountsOwner = document.getElementById('accounts-owner');
    if (accountsOwner) accountsOwner.textContent = session.name;

    if (accountsList) {
        accountsList.innerHTML = accounts.length ? accounts.map((account, index) => `
            <article class="account-row ${index === 0 ? 'account-row--featured' : ''}">
                <div class="account-meta">
                    <div class="account-topline">
                        <span>${account.type}</span>
                        <strong class="account-currency">${account.currency || session.currency}</strong>
                    </div>
                    <div class="account-name">${account.name}</div>
                </div>
                <div class="account-end">
                    <div class="account-balance">${formatMoney(account.balance, account.currency || session.currency)}</div>
                    <div class="account-caption">Текущий доступный остаток</div>
                </div>
            </article>
        `).join('') : `<div class="empty-state">У пользователя пока нет счетов.</div>`;
    }

    const recentBody = document.getElementById('recent-transactions-body');
    if (recentBody) {
        recentBody.innerHTML = transactions.slice(0, 6).map((item) => `
            <tr>
                <td>${formatDate(item.date)}</td>
                <td>${item.category}</td>
                <td>${item.description}</td>
                <td class="${item.type === 'income' ? 'transaction-type-income' : 'transaction-type-expense'}">
                    ${item.type === 'income' ? '+' : '-'}${formatMoney(item.amount, session.currency)}
                </td>
            </tr>
        `).join('');
    }

    const budgetsList = document.getElementById('budgets-list');
    const budgetProfileName = document.getElementById('budget-profile-name');
    if (budgetProfileName) budgetProfileName.textContent = session.name;
    if (budgetsList) {
        budgetsList.innerHTML = budgets.length ? budgets.map((budget) => {
            const progress = Math.min(100, Math.round((Number(budget.spent) / Number(budget.limit || 1)) * 100));
            return `
                <div class="chart-bar-wrap">
                    <div class="chart-bar-meta">
                        <span>${budget.category}</span>
                        <span>${formatMoney(budget.spent, session.currency)} / ${formatMoney(budget.limit, session.currency)}</span>
                    </div>
                    <div class="progress" role="progressbar" aria-label="Прогресс бюджета ${budget.category}"
                         aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar ${progress > 90 ? 'bg-danger' : progress > 70 ? 'bg-warning' : 'bg-success'}" style="width:${progress}%"></div>
                    </div>
                </div>
            `;
        }).join('') : `<div class="empty-state">Бюджеты пока не настроены.</div>`;
    }


    const pulseLines = document.getElementById('budget-pulse-lines');
    const pulseRing = document.getElementById('budget-pulse-ring');
    const pulseRingValue = document.getElementById('budget-pulse-ring-value');
    const pulseMonths = document.getElementById('budget-pulse-months');
    const monthPickerForm = document.getElementById('month-picker-form');
    const monthPickerMonth = document.getElementById('month-picker-month');
    const monthPickerYear = document.getElementById('month-picker-year');
    const monthPickerModalNode = document.getElementById('monthPickerModal');
    const monthPickerModal = monthPickerModalNode ? bootstrap.Modal.getOrCreateInstance(monthPickerModalNode) : null;
    const expenseMonthKeys = [...new Set(transactions
        .filter((item) => item.type === 'expense')
        .map((item) => getMonthKey(item.date)))].sort();
    const availablePulseMonths = expenseMonthKeys.length ? expenseMonthKeys : [getMonthKey(new Date().toISOString())];
    let activePulseMonth = availablePulseMonths[availablePulseMonths.length - 1];

    const getActivePulseIndex = () => availablePulseMonths.indexOf(activePulseMonth);

    const renderPulseMonthControls = () => {
        if (!pulseMonths) return;
        const currentIndex = getActivePulseIndex();
        pulseMonths.innerHTML = `
            <button class="month-nav__icon" type="button" data-direction="prev" aria-label="Предыдущий месяц" ${currentIndex <= 0 ? 'disabled' : ''}>‹</button>
            <button class="month-nav__current" type="button" data-action="open-picker" aria-haspopup="dialog">${formatMonthLabel(activePulseMonth)}</button>
            <button class="month-nav__icon" type="button" data-direction="next" aria-label="Следующий месяц" ${currentIndex >= availablePulseMonths.length - 1 ? 'disabled' : ''}>›</button>
        `;
    };

    const fillMonthPicker = () => {
        if (!monthPickerMonth || !monthPickerYear) return;
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        monthPickerMonth.innerHTML = monthNames.map((name, index) => `<option value="${String(index + 1).padStart(2, '0')}">${name}</option>`).join('');
        const years = [...new Set(availablePulseMonths.map((monthKey) => monthKey.slice(0, 4)))];
        monthPickerYear.innerHTML = years.map((year) => `<option value="${year}">${year}</option>`).join('');
        const [year, month] = activePulseMonth.split('-');
        monthPickerYear.value = year;
        monthPickerMonth.value = month;
    };

    const syncPulse = () => {
        renderPulseMonthControls();
        renderBudgetPulse(transactions, pulseLines, pulseRing, pulseRingValue, activePulseMonth);
    };

    if (pulseMonths) {
        pulseMonths.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) return;
            if (button.dataset.action === 'open-picker') {
                fillMonthPicker();
                monthPickerModal?.show();
                return;
            }
            const currentIndex = getActivePulseIndex();
            if (button.dataset.direction === 'prev' && currentIndex > 0) {
                activePulseMonth = availablePulseMonths[currentIndex - 1];
                syncPulse();
            }
            if (button.dataset.direction === 'next' && currentIndex < availablePulseMonths.length - 1) {
                activePulseMonth = availablePulseMonths[currentIndex + 1];
                syncPulse();
            }
        });
    }

    if (monthPickerForm) {
        monthPickerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(monthPickerForm);
            const monthKey = `${formData.get('year')}-${formData.get('month')}`;
            if (availablePulseMonths.includes(monthKey)) {
                activePulseMonth = monthKey;
                syncPulse();
            }
            monthPickerModal?.hide();
        });
    }

    syncPulse();

    const dashboardMetaAccounts = document.getElementById('dashboard-meta-accounts');
    const dashboardMetaTransactions = document.getElementById('dashboard-meta-transactions');
    const dashboardMetaBudgets = document.getElementById('dashboard-meta-budgets');
    if (dashboardMetaAccounts) dashboardMetaAccounts.textContent = String(accounts.length);
    if (dashboardMetaTransactions) dashboardMetaTransactions.textContent = String(transactions.length);
    if (dashboardMetaBudgets) dashboardMetaBudgets.textContent = String(budgets.length);

    syncQuickCategoryOptions();

    const quickForm = document.getElementById('quick-transaction-form');
    if (quickForm) {
        quickForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(quickForm);
            const record = {
                userId: session.id,
                date: formData.get('date') || new Date().toISOString().slice(0, 10),
                description: formData.get('description'),
                category: formData.get('category'),
                account: 'Основной счёт',
                type: formData.get('type'),
                amount: Number(formData.get('amount')),
            };

            await apiPost('transactions', record);
            window.location.reload();
        });
    }
}

function getCategoriesForType(type) {
    return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

function syncQuickCategoryOptions() {
    const typeSelect = document.getElementById('quick-type');
    const categorySelect = document.getElementById('quick-category');
    if (!typeSelect || !categorySelect) return;

    const renderOptions = () => {
        const categories = getCategoriesForType(typeSelect.value);
        categorySelect.innerHTML = categories.map((category) => `<option>${category}</option>`).join('');
    };

    renderOptions();
    typeSelect.addEventListener('change', renderOptions);
}

function getTransactionCategories(transactions) {
    return [...new Set(transactions.map((item) => item.category))].sort((a, b) => a.localeCompare(b, 'ru'));
}

function renderTransactionRows(rows, currency) {
    return rows.map((item) => `
        <tr class="transaction-row" tabindex="0" role="button" data-description="${item.description}"
            data-date="${formatDate(item.date)}" data-amount="${formatMoney(item.amount, currency)}"
            data-category="${item.category}" data-account="${item.account}" data-type="${item.type}">
            <td>${formatDate(item.date)}</td>
            <td>${item.description}</td>
            <td>${item.category}</td>
            <td>${item.account}</td>
            <td class="${item.type === 'income' ? 'transaction-type-income' : 'transaction-type-expense'}">
                ${item.type === 'income' ? 'Доход' : 'Расход'}
            </td>
            <td>${formatMoney(item.amount, currency)}</td>
        </tr>
    `).join('');
}

function filterTransactions(transactions, filters) {
    return transactions.filter((item) => {
        const query = filters.query?.trim().toLowerCase();
        const dateValue = item.date;
        const amount = Number(item.amount);

        if (query && !`${item.description} ${item.account} ${item.category}`.toLowerCase().includes(query)) return false;
        if (filters.category && item.category !== filters.category) return false;
        if (filters.type && item.type !== filters.type) return false;
        if (filters.minAmount && amount < Number(filters.minAmount)) return false;
        if (filters.maxAmount && amount > Number(filters.maxAmount)) return false;
        if (filters.dateFrom && dateValue < filters.dateFrom) return false;
        if (filters.dateTo && dateValue > filters.dateTo) return false;
        return true;
    });
}

async function initTransactionsPage(session) {
    if (!session) return;
    const { transactions } = await fetchUserData(session);

    const categorySelect = document.getElementById('filter-category');
    if (categorySelect) {
        categorySelect.insertAdjacentHTML('beforeend',
            getTransactionCategories(transactions).map((category) => `<option value="${category}">${category}</option>`).join(''));
    }

    const tableBody = document.getElementById('transactions-body');
    const empty = document.getElementById('transactions-empty');
    const counter = document.getElementById('transactions-counter');
    const form = document.getElementById('transactions-filters');

    const render = (rows) => {
        if (tableBody) {
            tableBody.innerHTML = renderTransactionRows(rows, session.currency);
        }

        if (counter) {
            counter.textContent = `Найдено операций: ${rows.length}`;
        }

        if (empty && tableBody) {
            empty.classList.toggle('d-none', rows.length > 0);
            tableBody.parentElement.parentElement.classList.toggle('d-none', rows.length === 0);
        }

        document.querySelectorAll('.transaction-row').forEach((row) => {
            const openModal = () => {
                alert(
                    `Операция: ${row.dataset.description}\n` +
                    `Дата: ${row.dataset.date}\n` +
                    `Категория: ${row.dataset.category}\n` +
                    `Счёт: ${row.dataset.account}\n` +
                    `Тип: ${row.dataset.type}\n` +
                    `Сумма: ${row.dataset.amount}`
                );
            };

            row.addEventListener('click', openModal);
            row.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openModal();
                }
            });
        });
    };

    render(transactions);

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const filters = Object.fromEntries(new FormData(form).entries());
            render(filterTransactions(transactions, filters));
        });

        form.addEventListener('reset', () => {
            setTimeout(() => render(transactions), 0);
        });
    }
}

async function initReportPage(session) {
    if (!session) return;
    const { accounts, transactions } = await fetchUserData(session);
    const incomeTransactions = transactions.filter((item) => item.type === 'income');
    const expenseTransactions = transactions.filter((item) => item.type === 'expense');
    const incomeTotal = incomeTransactions.reduce((sum, item) => sum + Number(item.amount), 0);
    const expenseTotal = expenseTransactions.reduce((sum, item) => sum + Number(item.amount), 0);
    const categoryTotals = Object.entries(groupBy(expenseTransactions, 'category')).map(([category, items]) => ({
        category,
        total: items.reduce((sum, item) => sum + Number(item.amount), 0),
    })).sort((a, b) => b.total - a.total);

    const averageExpense = expenseTransactions.length ? expenseTotal / expenseTransactions.length : 0;
    const topCategory = categoryTotals[0]?.category || '—';
    const currentBalance = accounts.reduce((sum, account) => sum + Number(account.balance), 0);
    const forecast = currentBalance - averageExpense;

    const averageNode = document.querySelector('[data-report-stat="avg-expense"]');
    const topCategoryNode = document.querySelector('[data-report-stat="top-category"]');
    const forecastNode = document.querySelector('[data-report-stat="forecast"]');
    const incomeNode = document.querySelector('[data-report-stat="income-total"]');
    const expenseNode = document.querySelector('[data-report-stat="expense-total"]');

    if (averageNode) averageNode.textContent = formatMoney(averageExpense, session.currency);
    if (topCategoryNode) topCategoryNode.textContent = topCategory;
    if (forecastNode) forecastNode.textContent = formatMoney(forecast, session.currency);
    if (incomeNode) incomeNode.textContent = formatMoney(incomeTotal, session.currency);
    if (expenseNode) expenseNode.textContent = formatMoney(expenseTotal, session.currency);

    const maxTotal = categoryTotals[0]?.total || 1;
    const chart = document.getElementById('expense-chart');
    if (chart) {
        chart.innerHTML = categoryTotals.map((item) => {
            const percent = Math.round((item.total / maxTotal) * 100);
            return `
                <div class="chart-bar-wrap">
                    <div class="chart-bar-meta">
                        <span>${item.category}</span>
                        <span>${formatMoney(item.total, session.currency)}</span>
                    </div>
                    <div class="chart-bar" aria-hidden="true">
                        <div class="chart-bar-fill" style="width:${percent}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    const donut = document.getElementById('report-donut');
    const donutValue = document.getElementById('report-donut-value');
    const donutList = document.getElementById('report-donut-list');
    const topThree = categoryTotals.slice(0, 3);
    const shares = topThree.map((item) => expenseTotal ? Math.round((item.total / expenseTotal) * 100) : 0);
    const primaryShare = shares[0] || 0;
    if (donut) {
        applyRingChart(donut, primaryShare, { parts: shares, centerText: `${primaryShare}%` });
    }
    if (donutValue) donutValue.textContent = `${primaryShare}%`;
    if (donutList) {
        donutList.innerHTML = topThree.map((item, index) => `
            <div class="report-donut-item"><span>${item.category}</span><em>${shares[index]}%</em></div>
        `).join('');
    }

    const insights = document.getElementById('insights-list');
    if (insights) {
        insights.innerHTML = `
            <div class="summary-item"><span>Текущий совокупный баланс</span><strong>${formatMoney(currentBalance, session.currency)}</strong></div>
            <div class="summary-item"><span>Средняя расходная операция</span><strong>${formatMoney(averageExpense, session.currency)}</strong></div>
            <div class="summary-item"><span>Самая затратная категория</span><strong>${topCategory}</strong></div>
            <div class="summary-item"><span>Количество счетов</span><strong>${formatPlainNumber(accounts.length)}</strong></div>
        `;
    }
}


function initNumericValidation() {
    document.querySelectorAll('input[type="number"][min]').forEach((input) => {
        const min = Number(input.getAttribute('min') || 0);
        const message = min > 0 ? 'Значение должно быть больше 0.' : 'Значение должно быть больше или равно 0.';
        input.addEventListener('invalid', () => input.setCustomValidity(message));
        input.addEventListener('input', () => input.setCustomValidity(''));
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    setupTheme();
    const pageName = document.body.dataset.page || 'home';
    const session = setupAuthState(pageName);
    updateNavigation();
    initNumericValidation();

    if (pageName === 'login') await initLoginPage();
    if (pageName === 'register') await initRegisterPage();
    if (pageName === 'dashboard') await initDashboardPage(session);
    if (pageName === 'transactions') await initTransactionsPage(session);
    if (pageName === 'report') await initReportPage(session);
});
