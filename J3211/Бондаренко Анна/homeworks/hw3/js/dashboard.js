window.renderDashboard = function () {
    if (!window.USERS || !window.USERS.userData) {
        return;
    }

    const accountsBody = document.getElementById('accountsTableBody');
    const transactionsBody = document.getElementById('transactionsTableBody');

    if (!accountsBody || !transactionsBody) {
        return;
    }

    window.USERS.renderTotalBalance();

    const accounts = window.USERS.userData.accounts;
    const transactions = window.USERS.userData.transactions;
    const categories = window.USERS.userData.categories;

    if (accounts.length === 0) {
        accountsBody.innerHTML = '<tr><td colspan="2" style="text-align:center;">[ СЧЕТА_НЕ_СОЗДАНЫ ]</td></tr>';
    } else {
        accountsBody.innerHTML = accounts.map(function (acc) {
            return `<tr><td>${acc.name}</td><td>${acc.balance.toFixed(2)}</td></tr>`;
        }).join('');
    }

    if (transactions.length === 0) {
        transactionsBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">[ ОПЕРАЦИЙ_НЕТ ]</td></tr>';
    } else {
        const recentTx = [...transactions].reverse().slice(0, 5);
        transactionsBody.innerHTML = recentTx.map(function (tx) {
            const isIncome = tx.sum > 0;
            const statusClass = isIncome ? 'text-income' : 'text-expense';
            const prefix = isIncome ? '+' : '';
            return `
            <tr>
                <td>${tx.date}</td>
                <td>${tx.account}</td>
                <td>${tx.desc || '-'}</td>
                <td>${tx.category}</td>
                <td class="${statusClass}">
                    ${prefix}${tx.sum.toFixed(2)}
                </td>
            </tr>`;
        }).join('');
    }

    const accSelector = document.getElementById('txAccount');
    const catSelector = document.getElementById('txCategory');

    if (accSelector) {
        accSelector.innerHTML = accounts.map(function (acc) {
            return `<option value="${acc.name}">${acc.name}</option>`;
        }).join('');
    }

    if (catSelector) {
        const catOptions = categories.map(function (cat) {
            const name = cat.name || cat;
            return `<option value="${name}">${name}</option>`;
        }).join('');
        catSelector.innerHTML = `<option value="РАЗНОЕ" selected>[ РАЗНОЕ ]</option>${catOptions}`;
    }
};

window.initExchangeRates = async function () {
    try {
        const rates = await window.API.getExchangeRates();

        const rowsMap = {
            cRow1: ['USD'],
            cRow2: ['EUR', 'CNY', 'GBP'],
            cRow3: ['TRY', 'KZT', 'BYN', 'AED']
        };

        const genCard = function (code, colClass) {
            const currency = rates[code];

            if (!currency) {
                return '';
            }

            return `
            <div class="${colClass}">
                <div class="dashboard-block mb-0" style="padding: 0; box-shadow: none; border: var(--border); overflow: hidden; background: var(--surface-color);">
                    <div class="block-title" style="margin: 0; padding: 5px 10px; font-size: 15px; background: var(--border-color); color: var(--surface-color);">
                        ${currency.Name.toUpperCase()}
                    </div>
                    <div class="text-center" style="padding: 15px; font-size: 18px; font-weight: 700; color: var(--border-color);">
                        ${code}: ${currency.Value.toFixed(2)}
                    </div>
                </div>
            </div>`;
        };

        if (document.getElementById('cRow1')) {
            document.getElementById('cRow1').innerHTML = rowsMap.cRow1.map(function (code) {
                return genCard(code, 'col-12');
            }).join('');

            document.getElementById('cRow2').innerHTML = rowsMap.cRow2.map(function (code) {
                return genCard(code, 'col-md-4');
            }).join('');

            document.getElementById('cRow3').innerHTML = rowsMap.cRow3.map(function (code) {
                return genCard(code, 'col-md-3');
            }).join('');
        }

    } catch (error) {
        console.error(error);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
        btn.onclick = function () {
            document.getElementById(btn.getAttribute('data-close-modal')).classList.remove('active');
        };
    });

    const txModal = document.getElementById('txModal');
    let txType = 'expense';

    const txDesc = document.getElementById('txDesc');
    const txCat = document.getElementById('txCategory');

    if (txDesc) {
        txDesc.oninput = function () {
            const val = txDesc.value.toUpperCase();
            const rules = window.USERS.userData.rules;
            const found = rules.find(r => val.includes(r.triggerWord.toUpperCase()));
            if (found) {
                txCat.value = found.category;
            }
        };
    }

    const btnOpenTx = document.getElementById('openModalBtn');
    if (btnOpenTx) {
        btnOpenTx.onclick = function () {
            if (!window.USERS.userData || window.USERS.userData.accounts.length === 0) {
                alert('ОШИБКА: СНАЧАЛА СОЗДАЙТЕ СЧЁТ!');
                return;
            }
            txType = 'expense';
            txModal.querySelectorAll('.tx-type-btn').forEach(function (btn) {
                btn.classList.toggle('active', btn.getAttribute('data-type') === 'expense');
            });
            document.getElementById('txSum').className = 'terminal-input input-expense';

            document.getElementById('txDate').max = new Date().toISOString().split("T")[0];
            txModal.classList.add('active');
        };
    }

    if (txModal) {
        txModal.querySelectorAll('.tx-type-btn').forEach(function (btn) {
            btn.onclick = function () {
                txType = btn.getAttribute('data-type');
                txModal.querySelectorAll('.tx-type-btn').forEach(b => b.classList.toggle('active', b === btn));
                document.getElementById('txSum').className = 'terminal-input input-' + txType;
            };
        });
    }

    const txForm = document.getElementById('txForm');
    if (txForm) {
        txForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const date = document.getElementById('txDate').value;
            if (!date) {
                alert('ОШИБКА: ВВЕДИТЕ ДАТУ ОПЕРАЦИИ!');
                return;
            }
            const sum = parseFloat(document.getElementById('txSum').value);
            const accName = document.getElementById('txAccount').value;
            const targetAcc = window.USERS.userData.accounts.find(acc => acc.name === accName);

            if (targetAcc && !isNaN(sum)) {
                const finalSum = (txType === 'income') ? sum : -sum;
                const newTx = {
                    userId: Number(window.USERS.currentUserId),
                    account: accName,
                    date: date,
                    desc: document.getElementById('txDesc').value.trim().toUpperCase() || '-',
                    category: document.getElementById('txCategory').value,
                    sum: finalSum
                };

                await window.API.createTransaction(newTx);
                await window.API.updateAccount(targetAcc.id, {balance: targetAcc.balance + finalSum});
                location.reload();
            }
        });
    }

    const accForm = document.getElementById('addAccountForm');
    if (accForm) {
        accForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const name = document.getElementById('newAccountName').value.trim().toUpperCase();
            const balance = parseFloat(document.getElementById('newAccountBalance').value) || 0;

            const newAcc = {
                userId: Number(window.USERS.currentUserId),
                name: name,
                balance: balance
            };

            await window.API.createAccount(newAcc);
            location.reload();
        });
    }

    const btnOpenAcc = document.getElementById('openAddAccountModalBtn');
    if (btnOpenAcc) {
        btnOpenAcc.onclick = function () {
            document.getElementById('addAccountModal').classList.add('active');
        };
    }
});
