const userId = localStorage.getItem('mff_user_id');
let allTransactions = [];
let accountMap = {};
let allAccounts = [];

async function loadTransactions() {
    try {
        const [transRes, accRes] = await Promise.all([
            fetch(`http://localhost:3000/transactions?userId=${userId}`),
            fetch(`http://localhost:3000/accounts?userId=${userId}`)
        ]);

        allTransactions = await transRes.json();

        allTransactions.reverse();
        allTransactions.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        const uniqueCategories = [...new Set(allTransactions.map(t => t.category))].filter(Boolean);

        const filterSelect = document.getElementById('categoryFilter');
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="all">Все категории</option>';
            uniqueCategories.forEach(cat => {
                filterSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
            });
        }

        const datalist = document.getElementById('categoryList');
        if (datalist) {
            datalist.innerHTML = '';
            uniqueCategories.forEach(cat => {
                datalist.innerHTML += `<option value="${cat}">`;
            });
        }

        allAccounts = await accRes.json();

        allAccounts.forEach(acc => { accountMap[acc.id] = acc.name; });

        const accSelect = document.getElementById('accountFilter');
        if (accSelect) {
            accSelect.innerHTML = '<option value="all">Все счета</option>';
            allAccounts.forEach(acc => {
                accSelect.innerHTML += `<option value="${acc.id}">${acc.name}</option>`;
            });
        }

        const newTransAccSelect = document.getElementById('newTransAccount');
        if (newTransAccSelect) {
            newTransAccSelect.innerHTML = '';
            allAccounts.forEach(acc => {
                newTransAccSelect.innerHTML += `<option value="${acc.id}">${acc.name} (${acc.balance} ₽)</option>`;
            });
        }
        const urlParams = new URLSearchParams(window.location.search);
        const filterAccountId = urlParams.get('accountId');

        if (filterAccountId) {
            document.getElementById('accountFilter').value = filterAccountId;
            const filtered = allTransactions.filter(t => String(t.accountId) === filterAccountId);
            renderTable(filtered);
        } else {
            renderTable(allTransactions);
        }
    } catch (e) {
        console.error('Ошибка загрузки:', e);
    }
}

function renderTable(data) {
    const tbody = document.getElementById('transTable');
    if(!tbody) return;
    tbody.innerHTML = '';

    data.forEach(t => {
        const accName = accountMap[t.accountId] || 'Неизвестный счет';
        const sign = t.type === 'expense' ? '-' : '+';
        const colorClass = t.type === 'expense' ? 'text-danger' : 'text-success';

        let displayDate = t.date;
        if (t.date) {
            const dateObj = new Date(t.date);
            if (!isNaN(dateObj)) {
                displayDate = dateObj.toLocaleDateString('ru-RU');
            }
        }

        tbody.innerHTML += `
              <tr>
                  <td class="align-middle">${displayDate || 'Нет даты'}</td>
                  <td class="align-middle">${t.description || t.category}</td>
                  <td class="align-middle">${accName}</td>
                  <td class="align-middle">${t.category}</td>
                  <td class="align-middle ${colorClass} fw-bold">${sign}${t.amount} ₽</td>
              </tr>
          `;
    });
}

document.getElementById('filterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const keyword = document.getElementById('searchInput').value.toLowerCase().trim();
    let category = document.getElementById('categoryFilter').value;
    let accountId = document.getElementById('accountFilter').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;

    if (category === 'Все категории') category = 'all';
    if (accountId === 'Все счета') accountId = 'all';

    const filtered = allTransactions.filter(t => {
        const textMatch = !keyword ||
            (t.description && t.description.toLowerCase().includes(keyword)) ||
            (t.category && t.category.toLowerCase().includes(keyword));

        const catMatch = category === 'all' || category === '' || t.category === category;

        const accMatch = accountId === 'all' || accountId === '' || String(t.accountId) === accountId;

        let dateMatch = true;
        if (t.date && (dateFrom || dateTo)) {
            const trDate = new Date(t.date);
            if (dateFrom && trDate < new Date(dateFrom)) dateMatch = false;
            if (dateTo && trDate > new Date(dateTo)) dateMatch = false;
        }

        return textMatch && catMatch && accMatch && dateMatch;
    });

    renderTable(filtered);
});

document.getElementById('addTransactionForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const desc = document.getElementById('newTransDesc').value;
    const category = document.getElementById('newTransCategory').value;
    const date = document.getElementById('newTransDate').value;
    const accountId = document.getElementById('newTransAccount').value;
    const type = document.getElementById('newTransType').value;
    const amount = Number(document.getElementById('newTransAmount').value);

    const selectedAccount = allAccounts.find(a => String(a.id) === String(accountId));
    const accCurrency = selectedAccount ? selectedAccount.currency : '₽';

    const newTx = {
        userId: Number(userId),
        accountId: accountId.match(/^[0-9]+$/) ? Number(accountId) : accountId,
        type: type,
        amount: amount,
        currency: accCurrency,
        category: category,
        description: desc,
        date: date
    };

    try {
        await fetch('http://localhost:3000/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTx)
        });

        const accRes = await fetch(`http://localhost:3000/accounts/${accountId}`);
        const account = await accRes.json();

        let newBalance = account.balance;
        if (type === 'expense') {
            newBalance -= amount;
        } else {
            newBalance += amount;
        }

        await fetch(`http://localhost:3000/accounts/${accountId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ balance: newBalance })
        });

        const modalEl = document.getElementById('addTransactionModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();

        this.reset();
        loadTransactions();

    } catch (error) {
        console.error('Ошибка сохранения:', error);
        alert('Произошла ошибка при сохранении транзакции.');
    }
});

if(userId) {
    loadTransactions();
}