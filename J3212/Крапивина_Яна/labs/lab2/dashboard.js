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

    const tableBody = document.getElementById('recentTransactionsBody');
    if (tableBody) {
        tableBody.innerHTML = ''; 
        
        const recent = data.slice(-3).reverse(); 

        recent.forEach(trans => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-3">${trans.date}</td>
                <td class="p-3">${trans.description}</td>
                <td class="p-3" style="color: ${trans.amount < 0 ? '#ff6b6b' : '#20c997'}">
                    ${trans.amount.toLocaleString()} ₽
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    data.forEach(trans => {
        if (trans.amount > 0) income += trans.amount;
        else expenses += trans.amount;
    });

    document.getElementById('totalBalance').innerText = `${(income + expenses).toLocaleString()} ₽`;
    document.getElementById('totalIncome').innerText = `+${income.toLocaleString()} ₽`;
    document.getElementById('totalExpenses').innerText = `${expenses.toLocaleString()} ₽`;
}

async function loadCurrencyRates() {
    try {
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        const data = await response.json();
        const usd = data.Valute.USD.Value.toFixed(2);
        const eur = data.Valute.EUR.Value.toFixed(2);

        document.getElementById('currencyRates').innerHTML = `
            <div class="me-4">USD: <b>${usd} ₽</b></div>
            <div>EUR: <b>${eur} ₽</b></div>
        `;
    } catch (e) {
        console.log("Валюты не загрузились");
    }
}