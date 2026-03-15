document.addEventListener('DOMContentLoaded', function() {
    const transactionsTableBody = document.getElementById('transactionsTableBody');
    const accountsTableBody = document.getElementById('accountsTableBody');

    if (!accountsTableBody || !transactionsTableBody) return;

    const renderDashboard = function() {
        USERS.renderTotalBalance();

        const currentAccounts = USERS.userData.accounts;
        const currentTransactions = USERS.userData.transactions;
        const currentCategories = USERS.userData.categories;

        if (currentAccounts.length === 0) {
            accountsTableBody.innerHTML = '<tr><td colspan="2" style="text-align:center;">[ СЧЕТА_НЕ_СОЗДАНЫ ]</td></tr>';
        } else {
            accountsTableBody.innerHTML = currentAccounts.map(function(account) {
                return `
                <tr>
                    <td>${account.name}</td>
                    <td>${account.balance.toFixed(2)}</td>
                </tr>`;
            }).join('');
        }

        if (currentTransactions.length === 0) {
            transactionsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">[ ОПЕРАЦИЙ_НЕТ ]</td></tr>';
        } else {
            const lastFiveTransactions = [...currentTransactions].reverse().slice(0, 5);

            transactionsTableBody.innerHTML = lastFiveTransactions.map(function(transaction) {
                const isIncome = transaction.sum > 0;
                const textColorClass = isIncome ? 'text-income' : 'text-expense';
                const prefix = isIncome ? '+' : '';

                return `
                <tr>
                    <td>${transaction.date}</td>
                    <td>${transaction.account}</td>
                    <td>${transaction.desc || '-'}</td>
                    <td>${transaction.category}</td>
                    <td class="${textColorClass}">
                        ${prefix}${transaction.sum.toFixed(2)}
                    </td>
                </tr>`;
            }).join('');
        }

        const accountSelect = document.getElementById('txAccount');
        const categorySelect = document.getElementById('txCategory');

        if (accountSelect) {
            accountSelect.innerHTML = currentAccounts.map(function(account) {
                return `<option value="${account.name}">${account.name}</option>`;
            }).join('');
        }

        if (categorySelect) {
            const categoryOptions = currentCategories.map(function(category) {
                return `<option value="${category}">${category}</option>`;
            }).join('');

            categorySelect.innerHTML = `
                <option value="РАЗНОЕ" selected>[ РАЗНОЕ ]</option>
                ${categoryOptions}
            `;
        }
    };

    document.querySelectorAll('[data-close-modal]').forEach(function(closeButton) {
        closeButton.addEventListener('click', function() {
            const targetModalId = closeButton.getAttribute('data-close-modal');
            const modalElement = document.getElementById(targetModalId);
            modalElement.classList.remove('active');
        });
    });

    const transactionModal = document.getElementById('txModal');
    const transactionSumInput = document.getElementById('txSum');
    const transactionDescriptionInput = document.getElementById('txDesc');
    let currentTransactionType = 'expense';

    document.getElementById('openModalBtn').onclick = function() {
        if (USERS.userData.accounts.length === 0) {
            alert('ОШИБКА: СНАЧАЛА СОЗДАЙТЕ СЧЁТ!');
            return;
        }

        document.getElementById('txDate').max = new Date().toISOString().split("T")[0];
        document.getElementById('txForm').reset();

        transactionModal.classList.add('active');
        updateTransactionTypeSwitch('expense');
    };

    document.getElementById('openAddAccountModalBtn').onclick = function() {
        document.getElementById('addAccountModal').classList.add('active');
    };

    const updateTransactionTypeSwitch = function(selectedType) {
        currentTransactionType = selectedType;

        const expenseButton = transactionModal.querySelector('[data-type="expense"]');
        const incomeButton = transactionModal.querySelector('[data-type="income"]');

        expenseButton.classList.toggle('active', selectedType === 'expense');
        incomeButton.classList.toggle('active', selectedType === 'income');

        transactionSumInput.className = 'terminal-input input-' + selectedType;
    };

    transactionModal.querySelector('[data-type="expense"]').onclick = function() {
        updateTransactionTypeSwitch('expense');
    };

    transactionModal.querySelector('[data-type="income"]').onclick = function() {
        updateTransactionTypeSwitch('income');
    };

    transactionDescriptionInput.addEventListener('input', function(event) {
        const descriptionValue = event.target.value.toUpperCase();

        const foundRule = USERS.userData.rules.find(function(rule) {
            return descriptionValue.includes(rule.triggerWord.toUpperCase());
        });

        if (foundRule) {
            document.getElementById('txCategory').value = foundRule.category;
        }
    });

    document.getElementById('txForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const sumValue = parseFloat(transactionSumInput.value);
        const dateValue = document.getElementById('txDate').value;
        const accountName = document.getElementById('txAccount').value;
        const selectedCategory = document.getElementById('txCategory').value;
        const descriptionText = transactionDescriptionInput.value.trim().toUpperCase();

        if (!dateValue) {
            alert('ОШИБКА: ВВЕДИТЕ ДАТУ ОПЕРАЦИИ!');
            return;
        }

        const targetAccount = USERS.userData.accounts.find(function(account) {
            return account.name === accountName;
        });

        if (targetAccount && !isNaN(sumValue)) {
            const finalAmount = (currentTransactionType === 'income') ? sumValue : -sumValue;

            targetAccount.balance = targetAccount.balance + finalAmount;

            USERS.userData.transactions.push({
                account: accountName,
                date: dateValue,
                desc: descriptionText || '-',
                category: selectedCategory,
                sum: finalAmount
            });

            USERS.save();
            renderDashboard();
            transactionModal.classList.remove('active');
        } else {
            alert('ОШИБКА: ПРОВЕРЬТЕ СУММУ');
        }
    });

    const addAccountForm = document.getElementById('addAccountForm');
    addAccountForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nameInput = document.getElementById('newAccountName');
        const balanceInput = document.getElementById('newAccountBalance');
        const newNameValue = nameInput.value.trim().toUpperCase();
        const initialBalanceValue = parseFloat(balanceInput.value) || 0;

        if (newNameValue === "") {
            alert("ОШИБКА: ВВЕДИТЕ НАЗВАНИЕ СЧЕТА!");
            return;
        }

        const isDuplicate = USERS.userData.accounts.find(function(account) {
            return account.name === newNameValue;
        });

        if (isDuplicate) {
            alert("ОШИБКА: ТАКОЙ СЧЕТ УЖЕ СУЩЕСТВУЕТ!");
            return;
        }

        USERS.userData.accounts.push({
            name: newNameValue,
            balance: initialBalanceValue
        });

        USERS.save();
        renderDashboard();

        document.getElementById('addAccountModal').classList.remove('active');
        addAccountForm.reset();
    });

    renderDashboard();
});