export function showModal(title, message) {

    if (typeof bootstrap === "undefined") {
        alert(title + "\n\n" + message);
        return;
    }

    const prev = document.getElementById("mbe-modal");
    if (prev) prev.remove();

    const html = `
    <div class="modal fade" id="mbe-modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${title}</h5>
                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                   <button class="btn btn-primary fw-semibold"
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
    <div class="modal fade" id="mbe-modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Добавить транзакцию</h5>
                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form id="transactionForm">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Дата</label>
                            <input type="date" name="date" class="form-control" value="${today}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Категория</label>
                            <select name="category" class="form-select" required>
                                <option value="">Выберите категорию</option>
                                ${categoryOptions}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Счёт</label>
                            <select name="accountId" class="form-select" required>
                                <option value="">Выберите счёт</option>
                                ${accountOptions}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Сумма</label>
                            <input type="number" name="amount" class="form-control" step="0.01" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Комментарий</label>
                            <input type="text" name="comment" class="form-control" placeholder="Опционально">
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
    <div class="modal fade" id="mbe-modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Настройки уведомлений</h5>
                    <button class="btn-close" data-bs-dismiss="modal"></button>
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
