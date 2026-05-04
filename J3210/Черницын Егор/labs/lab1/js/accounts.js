const userId = localStorage.getItem('mff_user_id');
if (!userId) window.location.href = 'login.html';

let allAccounts = [];

async function loadAccounts() {
    try {
        const [accRes, transRes] = await Promise.all([
            fetch(`http://localhost:3000/accounts?userId=${userId}`),
            fetch(`http://localhost:3000/transactions?userId=${userId}`)
        ]);

        allAccounts = await accRes.json();
        const transactions = await transRes.json();

        const container = document.getElementById('accountsContainer');
        if(!container) return;
        container.innerHTML = '';

        allAccounts.forEach((acc, index) => {
            const bgClass = 'acc-card-' + (index % 7);

            container.innerHTML += `
        <div class="col-md-6 col-lg-4">
            <div class="card shadow-sm border-0 rounded-4 h-100 p-2 ${bgClass}">
                <div class="card-body d-flex flex-column text-white">
                    <div class="d-flex justify-content-between align-items-start mb-4">
                        <span class="small fw-bold text-uppercase opacity-75">${acc.name}</span>
                        <span class="badge text-light rounded-pill">${acc.currency}</span>
                    </div>

                    <h2 class="fw-bolder mb-4 balance-amount" data-balance="${acc.balance} ${acc.currency}">
                        ${acc.balance.toLocaleString('ru-RU')} ${acc.currency}
                    </h2>

                    <div class="d-flex justify-content-between mt-auto">
                        <button onclick="openTransactionModal('${acc.id}')" class="btn btn-sm btn-outline-light rounded-circle fw-bold p-0 d-flex align-items-center justify-content-center shadow-sm btn-add-acc">
                            +
                        </button>
                        <a href="transact.html?accountId=${acc.id}" class="btn btn-sm btn-outline-light rounded-pill fw-bold px-3 d-flex align-items-center">
                            История
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `;
        });

        const uniqueCategories = [...new Set(transactions.map(t => t.category))].filter(Boolean);
        const datalist = document.getElementById('categoryList');

        if (datalist) {
            datalist.innerHTML = '';
            uniqueCategories.forEach(cat => {
                datalist.innerHTML += `<option value="${cat}">`;
            });
        }

    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// Эту функцию нужно сделать глобальной, так как она вызывается из inline onclick в HTML
window.openTransactionModal = function(accountId) {
    const select = document.getElementById('newTransAccount');
    select.innerHTML = '';

    allAccounts.forEach(acc => {
        const isSelected = acc.id === accountId ? 'selected' : '';
        select.innerHTML += `<option value="${acc.id}" ${isSelected}>${acc.name} (${acc.balance} ₽)</option>`;
    });

    document.getElementById('newTransDate').valueAsDate = new Date();

    const modal = new bootstrap.Modal(document.getElementById('addTransactionModal'));
    modal.show();
}

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

        const account = allAccounts.find(a => a.id === accountId);
        let newBalance = type === 'expense' ? account.balance - amount : account.balance + amount;

        await fetch(`http://localhost:3000/accounts/${accountId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ balance: newBalance })
        });

        const modalEl = document.getElementById('addTransactionModal');
        bootstrap.Modal.getInstance(modalEl).hide();

        this.reset();
        loadAccounts();

    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при сохранении транзакции.');
    }
});

document.getElementById('addAccountForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('newAccName').value;
    const balance = Number(document.getElementById('newAccBalance').value);
    const currency = document.getElementById('newAccCurr').value.split(' ')[0];

    const newAccount = {
        userId: Number(userId),
        name: name,
        balance: balance,
        currency: currency,
    };

    try {
        const res = await fetch('http://localhost:3000/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAccount)
        });

        if (res.ok) {
            bootstrap.Modal.getInstance(document.getElementById('addAccountModal')).hide();
            this.reset();
            loadAccounts();
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
});

loadAccounts();