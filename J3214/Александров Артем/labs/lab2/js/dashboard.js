// модуль управления данными Дашборда (GET, POST, DELETE)

document.addEventListener('DOMContentLoaded', async () => {
    // проверяем авторизацию
    const user = checkAuth();
    if (!user) return;

    // обновляем имя в шапке
    const welcomeTitle = document.querySelector('h1');
    if (welcomeTitle) welcomeTitle.textContent = `Добро пожаловать, ${user.name}!`;

    // первичная загрузка транзакций
    await loadAndRenderTransactions(user.id);

    // навешиваем слушатель на форму создания транзакции (POST)
    const addTxForm = document.querySelector('#addTransactionForm');
    if (addTxForm) {
        addTxForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.querySelector('#txTitle').value.trim();
        const amount = parseFloat(document.querySelector('#txAmount').value);
        const category = document.querySelector('#txCategory').value;

        const newTransaction = {
            userId: user.id,
            title: title,
            amount: amount,
            category: category,
            date: new Date().toISOString()
        };

        // вызываем POST-запрос
        const created = await createTransaction(newTransaction);

        if (created) {
            // закрываем модальное окно Bootstrap
            const modalEl = document.querySelector('#addTransactionModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();

            addTxForm.reset(); // очищаем форму
            await loadAndRenderTransactions(user.id); // перерисовываем список
        } else {
            alert('error when creating a transaction');
        }
        });
    }
});

//  загрузка и отрисовка списка транзакций

async function loadAndRenderTransactions(userId) {
    const container = document.querySelector('#transactionsContainer');
    if (!container) return;

    // GET-запрос транзакций текущего юзера
    const transactions = await getTransactions(userId);

    if (!transactions || transactions.length === 0) {
        container.innerHTML = `<div class="text-muted small text-center py-3">Транзакций пока нет</div>`;
        return;
    }

    // отрисовываем элементы + добавляем кнопку удаления
    container.innerHTML = transactions.map(tx => {
        const isIncome = tx.amount > 0;
        const amountClass = isIncome ? 'text-success' : 'text-dark';
        const amountPrefix = isIncome ? '+' : '';

        return `
        <div class="d-flex justify-content-between align-items-center pb-2 border-bottom border-light">
            
            <div class="d-flex align-items-center gap-3">
                <div class="bg-light rounded-3 d-flex justify-content-center align-items-center" style="width: 40px; height: 40px;">
                    <i class="bi ${isIncome ? 'bi-wallet2 text-success' : 'bi-cart3 text-secondary'} fs-5"></i>
                </div>

                <div>
                    <div class="fw-semibold text-dark" style="font-size: 14px;">${tx.title}</div>
                    <div class="text-muted" style="font-size: 11px;">${tx.category}</div>
                </div>
            </div>

            <div class="d-flex align-items-center gap-2">
                <span class="fw-bold ${amountClass}" style="font-size: 14px;">${amountPrefix}$${Math.abs(tx.amount).toFixed(2)}</span>

                <button class="btn btn-sm btn-outline-danger border-0 p-1" onclick="handleDeleteTx('${tx.id}', '${userId}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
        `;
    }).join('');
}


// функция удаления транзакции

async function handleDeleteTx(txId, userId) {
    if (!confirm('delete this transaction from the server?')) return;

    // отправляем DELETE-запрос на JSON-Server
    try {
        const response = await fetch(`${API_URL}/transactions/${txId}`, {
        method: 'DELETE'
        });

        if (response.ok) {
        await loadAndRenderTransactions(userId); // перерисовываем
        }
    } catch (error) {
        console.error('error when deleting:', error);
    }
}