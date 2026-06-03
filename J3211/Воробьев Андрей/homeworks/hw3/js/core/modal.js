export function showModal(title, message) {

    if (typeof bootstrap === "undefined") {
        alert(title + "\n\n" + message);
        return;
    }

    const prev = document.getElementById("mbe-modal");
    if (prev) prev.remove();

    const html = `
    <div class="modal fade" id="mbe-modal" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="mbe-modal-title" aria-describedby="mbe-modal-description">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="mbe-modal-title">${title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>
                <div class="modal-body">
                    <p id="mbe-modal-description">${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary fw-semibold"
                            data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);

    const modalEl = document.getElementById("mbe-modal");
    const modal = new bootstrap.Modal(modalEl);

    modal.show();

    modalEl.addEventListener("hidden.bs.modal", () => {
        modalEl.remove();
    });
}

export function showTransactionForm(accounts, categories, callback) {

    if (typeof bootstrap === "undefined") {
        alert("Форма создания транзакции");
        return;
    }

    const prev = document.getElementById("mbe-modal");
    if (prev) prev.remove();

    const today = new Date().toISOString().split('T')[0];
    const accountOptions = accounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join("");
    const categoryOptions = categories.map(cat => `<option>${cat}</option>`).join("");

    const html = `
    <div class="modal fade" id="mbe-modal" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="transaction-modal-title">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="transaction-modal-title">Добавить транзакцию</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>
                <form id="transactionForm">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label" for="transaction-date">Дата</label>
                            <input type="date" id="transaction-date" name="date" class="form-control" value="${today}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="transaction-category">Категория</label>
                            <select id="transaction-category" name="category" class="form-select" required>
                                <option value="">Выберите категорию</option>
                                ${categoryOptions}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="transaction-account">Счёт</label>
                            <select id="transaction-account" name="accountId" class="form-select" required>
                                <option value="">Выберите счёт</option>
                                ${accountOptions}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="transaction-amount">Сумма</label>
                            <input type="number" id="transaction-amount" name="amount" class="form-control" step="0.01" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="transaction-comment">Комментарий</label>
                            <input type="text" id="transaction-comment" name="comment" class="form-control" placeholder="Опционально">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="submit" class="btn btn-primary">Добавить</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);

    const modalEl = document.getElementById("mbe-modal");
    const modal = new bootstrap.Modal(modalEl);

    const form = document.getElementById("transactionForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            date: formData.get("date"),
            category: formData.get("category"),
            accountId: parseInt(formData.get("accountId")),
            amount: parseFloat(formData.get("amount")),
            comment: formData.get("comment")
        };
        callback(data);
        modal.hide();
    });

    modal.show();
    
    modalEl.addEventListener("hidden.bs.modal", () => {
        modalEl.remove();
    });
}

export function showRuleForm(settings, callback) {

    if (typeof bootstrap === "undefined") {
        alert("Форма настроек уведомлений");
        return;
    }

    const prev = document.getElementById("mbe-modal");
    if (prev) prev.remove();

    const current = settings || {};

    const html = `
    <div class="modal fade" id="mbe-modal" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="rule-modal-title">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="rule-modal-title">Настройки уведомлений</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>
                <form id="ruleForm">
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="largeExpenses" name="largeExpenses" ${current.largeExpenses ? "checked" : ""}>
                                    <label class="form-check-label" for="largeExpenses">Уведомлять о больших расходах</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="suspiciousTransactions" name="suspiciousTransactions" ${current.suspiciousTransactions ? "checked" : ""}>
                                    <label class="form-check-label" for="suspiciousTransactions">Уведомлять о подозрительных транзакциях</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="financialLiteracy" name="financialLiteracy" ${current.financialLiteracy ? "checked" : ""}>
                                    <label class="form-check-label" for="financialLiteracy">Напоминать о финансовой грамотности</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="weeklySummary" name="weeklySummary" ${current.weeklySummary ? "checked" : ""}>
                                    <label class="form-check-label" for="weeklySummary">Присылать еженедельную сводку</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="submit" class="btn btn-primary">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);
    const modalEl = document.getElementById("mbe-modal");
    const modal = new bootstrap.Modal(modalEl);
    const form = document.getElementById("ruleForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {
            largeExpenses: form.elements.largeExpenses.checked,
            suspiciousTransactions: form.elements.suspiciousTransactions.checked,
            financialLiteracy: form.elements.financialLiteracy.checked,
            weeklySummary: form.elements.weeklySummary.checked
        };
        callback(data);
        modal.hide();
    });

    modal.show();
    
    modalEl.addEventListener("hidden.bs.modal", () => {
        modalEl.remove();
    });
}
