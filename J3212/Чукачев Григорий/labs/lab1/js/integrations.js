document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("integrations-container");
    if (!container) return;

    async function loadBanks() {
        try {
            await new Promise(resolve => setTimeout(resolve, 600));

            const banksData = [
                { name: "СберБанк", domain: "sberbank.ru", status: "available", info: "Не подключен" },
                { name: "Т-Банк", domain: "tbank.ru", status: "available", info: "Не подключен" },
                { name: "ВТБ", domain: "vtb.ru", status: "available", info: "Не подключен" },
                { name: "Альфа-Банк", domain: "alfabank.ru", status: "available", info: "Не подключен" },
                { name: "Газпромбанк", domain: "gazprombank.ru", status: "available", info: "Не подключен" }
            ];

            container.innerHTML = "";

            banksData.forEach(bank => {
                const logoUrl = `https://www.google.com/s2/favicons?domain=${bank.domain}&sz=64`;

                const isConnected = bank.status === "connected";
                const btnClass = isConnected ? "btn-outline-danger" : "btn-success";
                const btnText = isConnected ? "Отключить" : "Подключить";

                const bankHTML = `
                    <div class="d-flex justify-content-between align-items-center mb-3 p-3 border rounded shadow-sm integration-item" style="transition: 0.2s;">
                        <div class="d-flex align-items-center">
                            <img src="${logoUrl}" alt="${bank.name}" width="40" height="40" class="rounded-circle me-3 border">
                            
                            <div>
                                <h6 class="mb-0 fw-bold">${bank.name}</h6>
                                <small class="text-muted status-text">${bank.info}</small>
                            </div>
                        </div>
                        <button class="btn ${btnClass} btn-sm action-btn" data-connected="${isConnected}">${btnText}</button>
                    </div>
                `;

                container.innerHTML += bankHTML;
            });

            document.querySelectorAll('.action-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const isConnected = this.getAttribute('data-connected') === 'true';

                    if (isConnected) {
                        this.className = "btn btn-success btn-sm action-btn";
                        this.textContent = "Подключить";
                        this.setAttribute('data-connected', 'false');
                        this.closest('.integration-item').querySelector('.status-text').textContent = "Не подключен";
                    } else {
                        this.className = "btn btn-outline-danger btn-sm action-btn";
                        this.textContent = "Отключить";
                        this.setAttribute('data-connected', 'true');
                        this.closest('.integration-item').querySelector('.status-text').textContent = "Подключен";
                    }
                });
            });

        } catch (error) {
            console.error("Ошибка:", error);
            container.innerHTML = "<div class='text-danger'>Ошибка загрузки</div>";
        }
    }

    loadBanks();
    const saveRuleBtn = document.getElementById("saveRuleBtn");
    const rulesList = document.getElementById("rulesList");

    if (saveRuleBtn && rulesList) {
        saveRuleBtn.addEventListener("click", () => {
            const keyword = document.getElementById("ruleKeyword").value;
            const category = document.getElementById("ruleCategory").value;

            if (!keyword || category === "Выберите категорию...") {
                alert("Пожалуйста, заполните все поля!");
                return;
            }

            const newRuleHTML = `
                <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                    <div>
                        <h6 class="mb-1 fw-bold">${keyword} <i class="bi bi-arrow-right mx-1 text-muted"></i> ${category}</h6>
                        <small class="text-muted">Пользовательское правило</small>
                    </div>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" checked style="transform: scale(1.3);">
                    </div>
                </div>
            `;

            rulesList.insertAdjacentHTML('beforeend', newRuleHTML);

            document.getElementById("ruleKeyword").value = "";
            document.getElementById("ruleCategory").selectedIndex = 0;
        });
    }
});