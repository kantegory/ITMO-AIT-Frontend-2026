const API_URL = "http://localhost:3000";

async function updateUI() {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) return;

    try {
        const res = await fetch(`${API_URL}/transactions?userId=${userId}`);
        const transactions = await res.json();

        let balance = 0, expenses = 0;
        transactions.forEach(t => {
            const amt = parseFloat(t.sum);
            if (t.type === 'plus') {
                balance += amt;
            } else {
                balance -= amt;
                expenses += amt;
            }
        });

        if (document.getElementById('accBalance')) {
            const accEl = document.getElementById('accBalance');
            accEl.innerText = (balance < 0 ? "- " : "") + Math.abs(balance).toLocaleString() + " ₽";
            accEl.style.color = balance < 0 ? "#dc3545" : "#333";
        }

        const budgetBar = document.getElementById('budgetBar');
        if (budgetBar) {
            const percent = Math.min((expenses / 50000) * 100, 100);
            budgetBar.style.width = percent + "%";
            document.getElementById('budgetStatus').innerText = `${expenses.toLocaleString()} из 50 000 ₽`;
        }

        const list = document.getElementById('recentTrans');
        if (list) {
            list.innerHTML = transactions.slice(-5).reverse().map(t => `
                <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                    <span>${t.cat}</span> 
                    <span class="${t.type === 'plus' ? 'text-success' : 'text-danger'} fw-bold">
                        ${t.type === 'plus' ? '+' : '-'}${parseFloat(t.sum).toLocaleString()} ₽
                    </span>
                </li>`).join('');
        }

        const nameDisplay = document.getElementById('userNameDisplay');
        if (nameDisplay) nameDisplay.innerText = localStorage.getItem('userFullName') || "";

        if (typeof renderCategoryChart === "function") renderCategoryChart(transactions);
        if (typeof renderMonthlyChart === "function") renderMonthlyChart(transactions);
        if (typeof calculateForecast === "function") calculateForecast(transactions);

    } catch (e) {
        console.error("Ошибка данных:", e);
    }
}

async function fetchCurrencyRates() {
    try {
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        const data = await response.json();
        const v = data.Valute;
        const usdEl = document.getElementById('rate-usd');
        if (usdEl) {
            usdEl.className = "card p-4 card-main-usd border-0 shadow text-center";
            usdEl.innerHTML = `<small class="text-uppercase fw-bold opacity-70">Курс Доллара (USD)</small>
                <h1 class="display-4 fw-bold mb-1">${v.USD.Value.toFixed(2)} ₽</h1>
                <div class="d-flex justify-content-center">
                    <span class="badge ${v.USD.Value > v.USD.Previous ? 'badge-soft-amber' : 'badge-soft-info'}">
                        ▲ ${(v.USD.Value - v.USD.Previous).toFixed(2)}
                    </span>
                </div>`;
            const codes = ['EUR', 'CNY', 'GBP', 'JPY', 'TRY', 'KZT', 'AMD'];
            codes.forEach(code => {
                const el = document.getElementById('rate-' + code.toLowerCase());
                if (el) {
                    el.className = "card p-3 currency-tinted border-0 text-center fw-bold h-100";
                    el.innerHTML = `<small class="text-muted d-block mb-1">${code}</small><div>${v[code].Value.toFixed(2)} ₽</div>`;
                }
            });
        }
    } catch (e) {
        console.error("Ошибка валют");
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('currentUserEmail');
    window.location.href = 'index.html';
}