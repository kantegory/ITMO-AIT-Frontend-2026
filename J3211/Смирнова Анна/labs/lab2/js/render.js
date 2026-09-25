if (typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
}

let balChart = null; 
let catChart = null;
let repChart = null; 

function updateDashboard() {
    let totalBal = 0, monthInc = 0, monthExp = 0;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    transactions.forEach(t => {
        const tDate = new Date(t.date);
        if (t.type === 'income') totalBal += t.amount;
        if (t.type === 'expense' || t.type === 'savings') totalBal -= t.amount; 
        
        if (tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth) {
            if (t.type === 'income') monthInc += t.amount;
            if (t.type === 'expense' || t.type === 'savings') monthExp += t.amount;
        }
    });

    document.getElementById('total-balance').innerText = `${totalBal.toLocaleString()} ₽`;
    document.getElementById('total-income').innerText = `+ ${monthInc.toLocaleString()} ₽`;
    document.getElementById('total-expense').innerText = `- ${monthExp.toLocaleString()} ₽`;
}

window.renderDashboardCharts = function() {
    const ctxBal = document.getElementById('balanceChart');
    const ctxCat = document.getElementById('categoryChart');
    if (!ctxBal || !ctxCat) return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const chartTextColor = isDark ? '#adb5bd' : '#6c757d';
    const chartGridColor = isDark ? '#333333' : '#e9ecef';

    const timeframe = document.getElementById('chart-timeframe') ? document.getElementById('chart-timeframe').value : 'month';
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let labels = [], netFlows = [], initialBalance = 0, expensesByCategory = {};

    if (timeframe === 'week') {
        labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        netFlows = Array(7).fill(0);
        const startOfWeek = getStartOfWeek(now);
        const endOfWeek = getEndOfWeek(now);

        transactions.forEach(t => {
            const d = new Date(t.date).getTime();
            const amount = t.type === 'income' ? t.amount : -t.amount;
            if (d < startOfWeek) initialBalance += amount;
            else if (d >= startOfWeek && d <= endOfWeek) {
                let dayIndex = new Date(t.date).getDay() - 1;
                if (dayIndex === -1) dayIndex = 6;
                netFlows[dayIndex] += amount;
                if (t.type === 'expense' || t.type === 'savings') expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
                else if (t.type === 'income' && t.category === 'Из копилки') expensesByCategory[t.desc] = (expensesByCategory[t.desc] || 0) - t.amount;
            }
        });
    } else if (timeframe === 'month') {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getTime();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        labels = Array.from({length: daysInMonth}, (_, i) => i + 1);
        netFlows = Array(daysInMonth).fill(0);

        transactions.forEach(t => {
            const dObj = new Date(t.date);
            const d = dObj.getTime();
            const amount = t.type === 'income' ? t.amount : -t.amount;

            if (d < firstDayOfMonth) initialBalance += amount;
            else if (dObj.getFullYear() === currentYear && dObj.getMonth() === currentMonth) {
                netFlows[dObj.getDate() - 1] += amount;
                if (t.type === 'expense' || t.type === 'savings') expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
                else if (t.type === 'income' && t.category === 'Из копилки') expensesByCategory[t.desc] = (expensesByCategory[t.desc] || 0) - t.amount;
            }
        });
    } else if (timeframe === 'year') {
        const firstDayOfYear = new Date(currentYear, 0, 1).getTime();
        labels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        netFlows = Array(12).fill(0);

        transactions.forEach(t => {
            const dObj = new Date(t.date);
            const d = dObj.getTime();
            const amount = t.type === 'income' ? t.amount : -t.amount;

            if (d < firstDayOfYear) initialBalance += amount;
            else if (dObj.getFullYear() === currentYear) {
                netFlows[dObj.getMonth()] += amount;
                if (t.type === 'expense' || t.type === 'savings') expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
                else if (t.type === 'income' && t.category === 'Из копилки') expensesByCategory[t.desc] = (expensesByCategory[t.desc] || 0) - t.amount;
            }
        });
    } else if (timeframe === 'all') {
        const years = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))].sort();
        labels = years.length ? years.map(String) : [currentYear.toString()];
        netFlows = Array(labels.length).fill(0);
        initialBalance = 0; 

        transactions.forEach(t => {
            const y = new Date(t.date).getFullYear().toString();
            const idx = labels.indexOf(y);
            const amount = t.type === 'income' ? t.amount : -t.amount;
            if (idx !== -1) {
                netFlows[idx] += amount;
                if (t.type === 'expense' || t.type === 'savings') expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
                else if (t.type === 'income' && t.category === 'Из копилки') expensesByCategory[t.desc] = (expensesByCategory[t.desc] || 0) - t.amount;
            }
        });
    }

    Object.keys(expensesByCategory).forEach(cat => {
        if (expensesByCategory[cat] <= 0) delete expensesByCategory[cat];
    });

    let cumulativeData = [];
    let currentBal = initialBalance;
    for (let i = 0; i < labels.length; i++) {
        currentBal += netFlows[i];
        cumulativeData.push(currentBal);
    }

    if (balChart) balChart.destroy();
    balChart = new Chart(ctxBal.getContext('2d'), {
        type: 'line',
        data: { labels: labels, datasets: [{ label: 'Баланс (₽)', data: cumulativeData, borderColor: '#0d6efd', backgroundColor: 'rgba(13, 110, 253, 0.1)', borderWidth: 3, fill: true, tension: 0.4, pointRadius: 3 }] },
        options: { 
            responsive: true, maintainAspectRatio: false, 
            scales: { 
                x: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } },
                y: { beginAtZero: false, ticks: { color: chartTextColor }, grid: { color: chartGridColor } } 
            }, 
            plugins: { datalabels: { display: false } } 
        }
    });

    if (catChart) catChart.destroy();
    const catLabels = Object.keys(expensesByCategory);
    const catData = Object.values(expensesByCategory);
    catChart = new Chart(ctxCat.getContext('2d'), {
        type: 'doughnut',
        data: { labels: catLabels.length ? catLabels : ['Нет данных'], datasets: [{ data: catData.length ? catData : [1], backgroundColor: catData.length ? ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6c757d', '#0dcaf0', '#8a2be2', '#ff7f50'] : ['#e9ecef'] }] },
        options: { 
            responsive: true, maintainAspectRatio: false, cutout: '60%', 
            plugins: { 
                datalabels: { display: false },
                legend: { labels: { color: chartTextColor } }
            } 
        }
    });
}

function updateFilterDropdown() {
    const filterSelect = document.getElementById('filter-category');
    if (!filterSelect) return;
    const currentVal = filterSelect.value;
    filterSelect.innerHTML = '<option value="all">Все категории</option>';
    
    const expCats = getCategoriesByType('expense').sort();
    if(expCats.length) {
        const expGroup = document.createElement('optgroup'); expGroup.label = 'Расходы';
        expCats.forEach(cat => expGroup.appendChild(new Option(cat, cat)));
        filterSelect.appendChild(expGroup);
    }

    const incCats = getCategoriesByType('income').sort();
    const incGroup = document.createElement('optgroup'); incGroup.label = 'Доходы';
    incCats.forEach(cat => incGroup.appendChild(new Option(cat, cat)));
    incGroup.appendChild(new Option('Из копилки', 'Из копилки')); 
    filterSelect.appendChild(incGroup);

    if (goals.length > 0) {
        const goalGroup = document.createElement('optgroup'); goalGroup.label = 'Копилки';
        goals.map(g => g.name).sort().forEach(cat => goalGroup.appendChild(new Option(cat, cat)));
        filterSelect.appendChild(goalGroup);
    }

    filterSelect.value = currentVal;
    if (filterSelect.selectedIndex === -1) filterSelect.value = 'all';
}

function renderTransactions() {
    const tbody = document.getElementById('transactions-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    
    const catFilter = document.getElementById('filter-category') ? document.getElementById('filter-category').value : 'all';
    const minVal = document.getElementById('filter-min') ? document.getElementById('filter-min').value : '';
    const minAmount = minVal !== '' ? parseFloat(minVal) : 0;
    const maxVal = document.getElementById('filter-max') ? document.getElementById('filter-max').value : '';
    const maxAmount = maxVal !== '' ? parseFloat(maxVal) : Infinity;
    const startDate = document.getElementById('filter-date-start') ? document.getElementById('filter-date-start').value : '';
    const endDate = document.getElementById('filter-date-end') ? document.getElementById('filter-date-end').value : '';

    let filtered = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (catFilter !== 'all') filtered = filtered.filter(t => t.category === catFilter);
    filtered = filtered.filter(t => t.amount >= minAmount && t.amount <= maxAmount);
    if (startDate) filtered = filtered.filter(t => new Date(t.date) >= new Date(startDate));
    if (endDate) filtered = filtered.filter(t => new Date(t.date) <= new Date(endDate));

    if(filtered.length === 0) { 
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">Транзакции не найдены</td></tr>`; 
        return; 
    }

    filtered.forEach(t => {
        const isInc = t.type === 'income';
        const isSav = t.type === 'savings';
        const isWithdrawal = t.type === 'income' && t.category === 'Из копилки';
        
        let colorClass = isInc ? 'text-success' : 'text-danger';
        let sign = isInc ? '+' : '-';
        if (isSav) { colorClass = 'text-primary'; sign = '-'; } 
        else if (isWithdrawal) { colorClass = 'text-warning'; sign = '+'; }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(t.date).toLocaleDateString('ru-RU')}</td>
            <td><strong>${t.desc}</strong></td>
            <td><span class="badge bg-secondary">${t.category}</span></td>
            <td class="${colorClass} fw-bold">${sign} ${t.amount.toLocaleString()} ₽</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editTransaction('${t.id}')" aria-label="Редактировать транзакцию: ${t.desc}">
                    <i class="bi bi-pencil" aria-hidden="true"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTransaction('${t.id}')" aria-label="Удалить транзакцию: ${t.desc}">
                    <i class="bi bi-trash" aria-hidden="true"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.renderReportsCharts = function() {
    const ctx = document.getElementById('reportsChart');
    if (!ctx) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const chartTextColor = isDark ? '#adb5bd' : '#6c757d';
    const chartGridColor = isDark ? '#333333' : '#e9ecef';

    const timeframe = document.getElementById('reports-timeframe') ? document.getElementById('reports-timeframe').value : 'month';
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let labels = [], incData = [], expData = [];

    if (timeframe === 'month') {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        labels = Array.from({length: daysInMonth}, (_, i) => i + 1);
        incData = Array(daysInMonth).fill(0);
        expData = Array(daysInMonth).fill(0);
        transactions.forEach(t => {
            const d = new Date(t.date);
            if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
                if(t.type === 'income') incData[d.getDate() - 1] += t.amount;
                if(t.type === 'expense' || t.type === 'savings') expData[d.getDate() - 1] += t.amount;
            }
        });
    } else if (timeframe === 'year') {
        labels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        incData = Array(12).fill(0);
        expData = Array(12).fill(0);
        transactions.forEach(t => {
            const d = new Date(t.date);
            if (d.getFullYear() === currentYear) {
                if(t.type === 'income') incData[d.getMonth()] += t.amount;
                if(t.type === 'expense' || t.type === 'savings') expData[d.getMonth()] += t.amount;
            }
        });
    } else if (timeframe === 'all') {
        const years = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))].sort();
        labels = years.length ? years.map(String) : [currentYear.toString()];
        let yearInc = {}, yearExp = {};
        years.forEach(y => { yearInc[y] = 0; yearExp[y] = 0; });
        transactions.forEach(t => {
            const y = new Date(t.date).getFullYear();
            if(t.type === 'income') yearInc[y] += t.amount;
            if(t.type === 'expense' || t.type === 'savings') yearExp[y] += t.amount;
        });
        incData = labels.map(l => yearInc[l] || 0);
        expData = labels.map(l => yearExp[l] || 0);
    }

    if (repChart) repChart.destroy();
    repChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Доходы (₽)', data: incData, borderColor: '#198754', backgroundColor: 'rgba(25, 135, 84, 0.2)', borderWidth: 3, fill: true, tension: 0.4, pointRadius: 4 },
                { label: 'Расходы (₽)', data: expData, borderColor: '#dc3545', backgroundColor: 'rgba(220, 53, 69, 0.2)', borderWidth: 3, fill: true, tension: 0.4, pointRadius: 4 }
            ]
        },
        options: { 
            responsive: true, maintainAspectRatio: false, 
            interaction: { mode: 'index', intersect: false }, 
            scales: { 
                x: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } },
                y: { beginAtZero: true, ticks: { color: chartTextColor }, grid: { color: chartGridColor } } 
            }, 
            plugins: { 
                legend: { position: 'top', labels: { color: chartTextColor, usePointStyle: true, padding: 20 } }, 
                datalabels: { 
                    backgroundColor: function(c) { return c.dataset.borderColor; }, 
                    borderRadius: 4, color: 'white', font: { weight: 'bold', size: 11 }, 
                    formatter: formatChartLabel, padding: { top: 3, bottom: 3, left: 6, right: 6 }, 
                    align: 'top', offset: 4 
                } 
            } 
        }
    });
}

function renderGoals() {
    const container = document.getElementById('goals-container');
    if (!container) return;
    container.innerHTML = '';

    if (goals.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-muted py-5">У вас пока нет целей. Создайте первую!</div>`;
        return;
    }

    goals.forEach(g => {
        let percent = (g.currentAmount / g.targetAmount) * 100;
        if (percent > 100) percent = 100; 
        let barColor = percent >= 100 ? 'bg-success' : percent > 50 ? 'bg-info' : 'bg-primary';
        
        const card = document.createElement('div');
        card.className = 'col-12 col-md-6 col-xl-4';
        card.innerHTML = `
            <div class="card border-0 shadow-sm h-100 p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <h2 class="m-0 fw-bold h5"><i class="bi bi-bullseye text-primary me-2" aria-hidden="true"></i>${g.name}</h2>
                    <div class="dropdown">
                        <button class="btn btn-light btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Действия с целью ${g.name}">
                            <i class="bi bi-three-dots-vertical" aria-hidden="true"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
                            <li><a class="dropdown-item" href="#" onclick="editGoal('${g.id}')"><i class="bi bi-pencil me-2" aria-hidden="true"></i>Редактировать</a></li>
                            <li><hr class="dropdown-divider" aria-hidden="true"></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="deleteGoal('${g.id}')"><i class="bi bi-trash me-2" aria-hidden="true"></i>Удалить</a></li>
                        </ul>
                    </div>
                </div>
                
                <div class="mb-3">
                    <div class="d-flex justify-content-between text-muted small mb-1">
                        <span>Накоплено: <strong>${g.currentAmount.toLocaleString()} ₽</strong></span>
                        <span>Цель: ${g.targetAmount.toLocaleString()} ₽</span>
                    </div>
                    <div class="progress" style="height: 10px;" role="progressbar" aria-label="Прогресс цели: ${g.name}" aria-valuenow="${percent.toFixed(0)}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar ${barColor}" style="width: ${percent}%"></div>
                    </div>
                    <div class="text-end text-muted small mt-1" aria-hidden="true">${percent.toFixed(1)}%</div>
                </div>

                <div class="d-flex gap-2 mt-auto">
                    <button class="btn btn-outline-success w-100" onclick="openAddFundsModal('${g.id}')">
                        <i class="bi bi-plus-circle me-1" aria-hidden="true"></i> Пополнить
                    </button>
                    <button class="btn btn-outline-warning w-100" onclick="openWithdrawFundsModal('${g.id}')" ${g.currentAmount <= 0 ? 'disabled' : ''}>
                        <i class="bi bi-dash-circle me-1" aria-hidden="true"></i> Снять
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function initAppUI() {
    const welcomeMsg = document.getElementById('welcome-msg');
    if (welcomeMsg && currentUser) welcomeMsg.innerText = `Добро пожаловать, ${currentUser.firstName}!`;
    if (document.getElementById('dashboard-cards')) { updateDashboard(); renderDashboardCharts(); }
    if (document.getElementById('transactions-table-body')) { updateFilterDropdown(); renderTransactions(); }
    if (document.getElementById('reportsChart')) { renderReportsCharts(); }
    if (document.getElementById('goals-container')) { renderGoals(); }
    if (document.getElementById('banks-list')) { 
        renderBanks(); 
        renderRules(); 
    }
}


// --- ИНТЕГРАЦИИ (БАНКИ И ПРАВИЛА) ---

window.renderBanks = function() {
    const container = document.getElementById('banks-list');
    if (!container) return;
    container.innerHTML = '';

    const availableBanks = [
        { id: 'sber', name: 'Сбербанк', icon: 'bi-bank text-success' },
        { id: 'tbank', name: 'Т-Банк', icon: 'bi-wallet2 text-warning' },
        { id: 'alfa', name: 'Альфа-Банк', icon: 'bi-credit-card text-danger' }
    ];

    availableBanks.forEach(b => {
        const connectedBank = banks.find(userBank => userBank.bankId === b.id);
        const isConnected = !!connectedBank;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-3';
        
        li.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi ${b.icon} fs-3 me-3" aria-hidden="true"></i> 
                <span class="fs-5">${b.name}</span>
            </div>
            ${isConnected 
                ? `<button class="btn btn-outline-danger btn-sm px-3" onclick="disconnectBank('${connectedBank.id}')">Отключить</button>`
                : `<button class="btn btn-primary btn-sm px-3" onclick="connectBank('${b.id}', '${b.name}')">Подключить</button>`
            }
        `;
        container.appendChild(li);
    });
}

window.renderRules = function() {
    const container = document.getElementById('rules-list');
    if (!container) return;
    container.innerHTML = '';

    if (rules.length === 0) {
        container.innerHTML = '<li class="list-group-item text-muted border-0 px-0">У вас пока нет правил импорта.</li>';
    } else {
        rules.forEach(rule => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2';
            li.innerHTML = `
                <div>
                    <strong>Если:</strong> "${rule.keyword}" <i class="bi bi-arrow-right text-muted mx-2" aria-hidden="true"></i> <strong>Категория:</strong> <span class="badge bg-secondary">${rule.category}</span>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteRule('${rule.id}')" aria-label="Удалить правило для слова ${rule.keyword}">
                    <i class="bi bi-trash" aria-hidden="true"></i>
                </button>
            `;
            container.appendChild(li);
        });
    }

    const selectCategory = document.getElementById('rule-category');
    if (selectCategory) {
        selectCategory.innerHTML = '';
        const expenseCategories = getCategoriesByType('expense');

        if (expenseCategories.length === 0) {
            selectCategory.appendChild(new Option('Сначала создайте категорию расходов', '', false, false));
            selectCategory.disabled = true;
        } else {
            selectCategory.disabled = false;
            expenseCategories.forEach(catName => {
                selectCategory.appendChild(new Option(catName, catName));
            });
        }
    }
}