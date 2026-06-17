document.addEventListener('DOMContentLoaded', async () => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('welcomeText').innerText = `Добро пожаловать, ${userName}!`;

    try {
        const response = await fetch('http://localhost:3000/transactions');
        const transactions = await response.json();

        updateDashboardUI(transactions);
        
        loadCurrencyRates();
    } catch (error) {
        console.error("Ошибка загрузки:", error);
    }
});

function updateDashboardUI(data) {
    let income = 0;
    let expenses = 0;

    const catStats = {
        "Продукты": 0,
        "Развлечения": 0,
        "Подписки": 0,
        "Другое": 0,
        "Транспорт": 0
    };

    const tableBody = document.getElementById('recentTransactionsBody');
    if (tableBody) {
        tableBody.innerHTML = ''; 
        
        const recent = data.slice(-3).reverse(); 

        recent.forEach(trans => {
            const row = document.createElement('tr');
            row.tabIndex = 0;
            row.setAttribute('role', 'button');
            
            row.innerHTML = `
                <td class="p-3">${trans.date}</td>
                <td class="p-3">${trans.description}</td>
                <td class="p-3" style="color: ${trans.amount < 0 ? 'var(--color-danger)' : 'var(--color-success)'}">
                    ${trans.amount.toLocaleString()} ₽
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    data.forEach(trans => {
        const amt = parseFloat(trans.amount);
        if (amt > 0) {
            income += amt;
        } else {
            const absAmt = Math.abs(amt);
            expenses += absAmt;
            
            if (catStats.hasOwnProperty(trans.category)) {
                catStats[trans.category] += absAmt;
            } else {
                catStats["Другое"] += absAmt;
            }
        }
    });

    document.getElementById('totalBalance').innerText = `${(income - expenses).toLocaleString()} ₽`;
    document.getElementById('totalIncome').innerText = `+${income.toLocaleString()} ₽`;
    document.getElementById('totalExpenses').innerText = `-${expenses.toLocaleString()} ₽`;

    const updateBar = (idPrefix, currentCatAmount, totalExpenses) => {
        const percent = totalExpenses > 0 ? Math.round((currentCatAmount / totalExpenses) * 100) : 0;
        const fill = document.getElementById('prog-' + idPrefix);
        const cont = document.getElementById('cont-' + idPrefix);
        
        if (fill && cont) {
            fill.style.width = percent + "%";
            cont.setAttribute('aria-valuenow', percent);
        }
    };

    if (expenses > 0) {
        updateBar('food', catStats["Продукты"], expenses);
        updateBar('transport', catStats["Транспорт"], expenses);
        updateBar('cafe', catStats["Развлечения"], expenses);
        updateBar('subs', catStats["Подписки"], expenses);
        updateBar('transfers', catStats["Другое"], expenses);
    }
}

async function loadCurrencyRates() {
    try {
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        const data = await response.json();
        const usd = data.Valute.USD.Value.toFixed(2);
        const eur = data.Valute.EUR.Value.toFixed(2);

        const ratesCont = document.getElementById('currencyRates');
        if (ratesCont) {
            ratesCont.innerHTML = `
                <div class="me-5">USD: <b>${usd} ₽</b></div>
                <div>EUR: <b>${eur} ₽</b></div>
            `;
        }
    } catch (e) {
        console.log("Валюты не загрузились");
    }
}