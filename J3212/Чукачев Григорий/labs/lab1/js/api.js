document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll('#financeTabs .nav-link');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabButtons.forEach(b => {
                b.classList.remove('text-success', 'fw-bold');
                b.classList.add('text-muted');
            });
            e.target.classList.remove('text-muted');
            e.target.classList.add('text-success', 'fw-bold');
        });
    });

    const financeWidget = document.getElementById("financeTabsContent");
    if (financeWidget) {
        loadCurrencies();
        loadMetals();
        loadStocks();
    }
});

async function loadCurrencies() {
    try {
        const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
        const data = await response.json();
        const valutesToShow = ['USD', 'EUR', 'CNY'];

        const container = document.getElementById("currency-container");
        container.innerHTML = "";

        valutesToShow.forEach(code => {
            const valute = data.Valute[code];
            const diff = (valute.Value - valute.Previous).toFixed(2);
            const isUp = diff > 0;
            const diffColor = isUp ? "text-danger" : "text-success";
            const diffIcon = isUp ? "bi-arrow-up-right" : "bi-arrow-down-right";

            container.innerHTML += `
                <div class="col-md-4">
                    <div class="card shadow-sm border-0 h-100" style="border-radius: 15px;">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="fw-bold text-muted">${valute.Name}</span>
                                <span class="badge bg-light text-dark border">${valute.CharCode}</span>
                            </div>
                            <h3 class="mb-0 fw-bold">${valute.Value.toFixed(2)} ₽</h3>
                            <div class="${diffColor} small mt-1 fw-bold">
                                <i class="bi ${diffIcon}"></i> ${Math.abs(diff)} ₽
                            </div>
                        </div>
                    </div>
                </div>`;
        });
    } catch (error) {
        document.getElementById("currency-container").innerHTML = "<div class='text-danger w-100 text-center'>Ошибка загрузки валют</div>";
    }
}

async function loadMetals() {
    try {
        await new Promise(resolve => setTimeout(resolve, 600));

        const metalsData = [
            { name: "Золото", code: "XAU", price: 6850.40, trend: "+45.20", isUp: true, color: "#ffc107" },
            { name: "Серебро", code: "XAG", price: 82.15, trend: "-1.10", isUp: false, color: "#6c757d" },
            { name: "Платина", code: "XPT", price: 3100.00, trend: "+12.50", isUp: true, color: "#0dcaf0" }
        ];

        const container = document.getElementById("metals-container");
        container.innerHTML = "";

        metalsData.forEach(metal => {
            const diffColor = metal.isUp ? "text-success" : "text-danger";
            const diffIcon = metal.isUp ? "bi-arrow-up-right" : "bi-arrow-down-right";

            container.innerHTML += `
                <div class="col-md-4">
                    <div class="card shadow-sm border-0 h-100" style="border-radius: 15px; border-left: 4px solid ${metal.color} !important;">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2 gap-2">
                                <div class="fw-bold text-muted lh-sm">
                                    ${metal.name} 
                                    <div class="fw-normal" style="font-size: 0.75em;">(за 1 грамм)</div>
                                </div>
                                <span class="badge bg-light text-dark border flex-shrink-0">${metal.code}</span>
                            </div>
                            <h3 class="mb-0 fw-bold">${metal.price.toFixed(2)} ₽</h3>
                            <div class="${diffColor} small mt-1 fw-bold">
                                <i class="bi ${diffIcon}"></i> ${metal.trend} ₽
                            </div>
                        </div>
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error(error);
    }
}

async function loadStocks() {
    try {
        await new Promise(resolve => setTimeout(resolve, 800));

        const stocksData = [
            { name: "Сбербанк", ticker: "SBER", price: 295.50, percent: "+1.2%", isUp: true, domain: "sberbank.ru" },
            { name: "Яндекс", ticker: "YNDX", price: 3450.00, percent: "-0.5%", isUp: false, domain: "yandex.ru" },
            { name: "Газпром", ticker: "GAZP", price: 164.20, percent: "+0.8%", isUp: true, domain: "gazprom.ru" }
        ];

        const container = document.getElementById("stocks-container");
        container.innerHTML = "";

        stocksData.forEach(stock => {
            const diffColor = stock.isUp ? "text-success" : "text-danger";
            const diffIcon = stock.isUp ? "bi-arrow-up-right" : "bi-arrow-down-right";

            const logoUrl = `https://www.google.com/s2/favicons?domain=${stock.domain}&sz=64`;

            container.innerHTML += `
                <div class="col-md-4">
                    <div class="card shadow-sm border-0 h-100" style="border-radius: 15px;">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2 gap-2">
                                <div class="fw-bold text-muted d-flex align-items-center">
                                    <img src="${logoUrl}" alt="logo" width="20" height="20" class="me-2 rounded-circle">
                                    ${stock.name}
                                </div>
                                <span class="badge bg-light text-dark border flex-shrink-0">${stock.ticker}</span>
                            </div>
                            <h3 class="mb-0 fw-bold">${stock.price.toFixed(2)} ₽</h3>
                            <div class="${diffColor} small mt-1 fw-bold">
                                <i class="bi ${diffIcon}"></i> ${stock.percent} за день
                            </div>
                        </div>
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const recentTable = document.getElementById("recentTransactionsTable");
    const saveDashTxBtn = document.getElementById("saveDashTxBtn");

    async function loadRecentTransactions() {
        if (!recentTable) return;
        try {
            const response = await fetch("http://localhost:3000/transactions");
            let txs = await response.json();

            txs.sort((a, b) => new Date(b.date) - new Date(a.date));
            const recentTxs = txs.slice(0, 3);

            recentTable.innerHTML = "";

            if(recentTxs.length === 0) {
                recentTable.innerHTML = "<tr><td colspan='4' class='text-center text-muted'>Нет операций</td></tr>";
                return;
            }

            recentTxs.forEach(tr => {
                const dateObj = new Date(tr.date);
                const dateStr = dateObj.toLocaleDateString("ru-RU", { day: 'numeric', month: 'short' });

                const isExpense = tr.type === "expense";
                const color = isExpense ? "text-danger" : "text-success";
                const prefix = isExpense ? "- " : "+ ";

                let icon = "bi-tag";
                if(tr.category === "food") icon = "bi-cart";
                if(tr.category === "salary") icon = "bi-briefcase";

                recentTable.innerHTML += `
                    <tr>
                        <td class="text-muted small">${dateStr}</td>
                        <td><div class="fw-bold">${tr.title}</div></td>
                        <td><span class="badge bg-light text-dark border"><i class="bi ${icon} me-1"></i> ${tr.categoryName}</span></td>
                        <td class="${color} text-end fw-bold">${prefix}${tr.amount.toLocaleString('ru-RU')} ₽</td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error("Ошибка загрузки последних транзакций:", error);
        }
    }

    if (saveDashTxBtn) {

        const categoryNames = {
            food: "Продукты",
            transport: "Транспорт",
            entertainment: "Развлечения",
            salary: "Зарплата",
            other: "Разное"
        };

        saveDashTxBtn.addEventListener("click", async () => {
            const title = document.getElementById("dashTxTitle").value;
            const amount = document.getElementById("dashTxAmount").value;
            const type = document.getElementById("dashTxType").value;
            const category = document.getElementById("dashTxCategory").value;

            if (!title || !amount) {
                alert("Заполните название и сумму!");
                return;
            }

            const today = new Date().toISOString().split('T')[0];

            const newTransaction = {
                title: title,
                amount: Number(amount),
                type: type,
                date: today,
                category: category,
                categoryName: categoryNames[category]
            };

            try {
                const response = await fetch("http://localhost:3000/transactions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newTransaction)
                });

                if (response.ok) {
                    document.getElementById("dashTxTitle").value = "";
                    document.getElementById("dashTxAmount").value = "";
                    document.getElementById("dashTxCategory").selectedIndex = 0;

                    loadRecentTransactions();

                    const pushEnabled = localStorage.getItem("notifyPush") !== "false";

                    if (pushEnabled && type === "expense") {
                        try {
                            const allTxResponse = await fetch("http://localhost:3000/transactions");
                            const allTransactions = await allTxResponse.json();

                            let categoryTotal = 0;
                            const now = new Date();
                            const currentMonth = now.getMonth();
                            const currentYear = now.getFullYear();

                            allTransactions.forEach(t => {
                                const txDate = new Date(t.date);
                                if (t.type === "expense" &&
                                    t.category === category &&
                                    txDate.getMonth() === currentMonth &&
                                    txDate.getFullYear() === currentYear) {

                                    categoryTotal += t.amount;
                                }
                            });

                            const limits = {
                                food: 30000,
                                entertainment: 40000,
                                transport: 15000,
                                other: 10000
                            };

                            const limit = limits[category] || 10000;
                            const percentage = (categoryTotal / limit) * 100;

                            if (percentage >= 85) {
                                const toastEl = document.getElementById('limitToast');
                                const titleEl = document.getElementById('toastLimitTitle');
                                const textEl = document.getElementById('toastLimitText');

                                if (toastEl && titleEl && textEl) {
                                    titleEl.textContent = `Внимание: «${categoryNames[category]}»`;

                                    if (percentage >= 100) {
                                        toastEl.classList.replace("text-bg-warning", "text-bg-danger");
                                        textEl.textContent = `Лимит исчерпан! Потрачено ${categoryTotal.toLocaleString('ru-RU')} из ${limit.toLocaleString('ru-RU')} ₽.`;
                                    } else {
                                        toastEl.classList.replace("text-bg-danger", "text-bg-warning");
                                        textEl.textContent = `Израсходовано ${percentage.toFixed(0)}% лимита (${categoryTotal.toLocaleString('ru-RU')} из ${limit.toLocaleString('ru-RU')} ₽).`;
                                    }

                                    const toast = new bootstrap.Toast(toastEl);
                                    toast.show();
                                }
                            } else {
                                alert("Операция успешно добавлена!");
                            }

                        } catch (error) {
                            console.error("Ошибка проверки лимитов:", error);
                        }
                    } else {
                        alert("Операция успешно добавлена!");
                    }
                }
            } catch (error) {
                console.error("Ошибка сохранения транзакции:", error);
            }
        });
    }

    loadRecentTransactions();
});