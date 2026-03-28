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