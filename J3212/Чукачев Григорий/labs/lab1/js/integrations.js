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

    const rulesList = document.getElementById("rulesList");
    const saveRuleBtn = document.getElementById("saveRuleBtn");

    async function loadRules() {
        if (!rulesList) return;
        try {
            const response = await fetch("http://localhost:3000/rules");
            const rules = await response.json();

            rulesList.innerHTML = "";

            if (rules.length === 0) {
                rulesList.innerHTML = "<div class='text-center text-muted py-3'>Правил пока нет</div>";
                return;
            }

            rules.forEach(rule => {
                rulesList.innerHTML += `
                    <div class="list-group-item d-flex justify-content-between align-items-center py-3 integration-item">
                        <div>
                            <h6 class="mb-1 fw-bold">${rule.keyword} <i class="bi bi-arrow-right mx-1 text-muted"></i> ${rule.category}</h6>
                            <small class="text-muted">Сохраненное правило</small>
                        </div>
                        <div class="d-flex align-items-center">
                            <div class="form-check form-switch me-3">
                                <input class="form-check-input" type="checkbox" checked style="transform: scale(1.3);">
                            </div>
                            <button class="btn btn-sm btn-outline-danger border-0 delete-rule-btn" data-id="${rule.id}" title="Удалить правило">
                                <i class="bi bi-trash fs-5"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            document.querySelectorAll('.delete-rule-btn').forEach(btn => {
                btn.addEventListener('click', deleteRule);
            });

        } catch (error) {
            console.error("Ошибка загрузки правил:", error);
        }
    }

    if (saveRuleBtn) {
        saveRuleBtn.addEventListener("click", async () => {
            const keyword = document.getElementById("ruleKeyword").value;
            const category = document.getElementById("ruleCategory").value;

            if (!keyword || category === "Выберите категорию...") return alert("Заполните все поля!");

            const newRule = { keyword: keyword, category: category };

            try {
                const response = await fetch("http://localhost:3000/rules", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newRule)
                });

                if (response.ok) {
                    document.getElementById("ruleKeyword").value = "";
                    document.getElementById("ruleCategory").selectedIndex = 0;
                    loadRules();
                }
            } catch (error) { console.error(error); }
        });
    }

    async function deleteRule(event) {
        const ruleId = event.currentTarget.getAttribute('data-id');

        if (confirm("Точно удалить это правило автоматизации?")) {
            try {
                const response = await fetch(`http://localhost:3000/rules/${ruleId}`, {
                    method: "DELETE"
                });
                if (response.ok) {
                    loadRules();
                }
            } catch (error) { console.error(error); }
        }
    }

    loadRules();

    const notifyEmail = document.getElementById("notifyEmail");
    const notifyPush = document.getElementById("notifyPush");
    const saveStatus = document.getElementById("saveStatus");

    if (notifyEmail && notifyPush) {
        const savedEmail = localStorage.getItem("notifyEmail");
        const savedPush = localStorage.getItem("notifyPush");

        notifyEmail.checked = savedEmail === null ? true : savedEmail === "true";
        notifyPush.checked = savedPush === null ? true : savedPush === "true";

        function showSavedStatus() {
            if (!saveStatus) return;
            saveStatus.style.opacity = "1";
            setTimeout(() => {
                saveStatus.style.opacity = "0";
            }, 1500);
        }

        notifyEmail.addEventListener("change", (e) => {
            localStorage.setItem("notifyEmail", e.target.checked);
            showSavedStatus();
        });

        notifyPush.addEventListener("change", (e) => {
            localStorage.setItem("notifyPush", e.target.checked);
            showSavedStatus();
        });
    }
});