document.addEventListener('DOMContentLoaded', async () => {
    const monthSelect = document.getElementById('monthFilter');
    const accountSelect = document.getElementById('accountFilter');
    const updateBtn = document.getElementById('updateBtn');

    if (updateBtn) {
        updateBtn.addEventListener('click', () => location.reload());
    }

    async function updateReportData() {
        try {
            const response = await fetch('http://localhost:3000/transactions');
            const allTransactions = await response.json();

            const selectedMonth = monthSelect.value;
            const selectedAccount = accountSelect.value; 

            const filteredData = allTransactions.filter(t => {
                const matchesMonth = t.date.includes(`.${selectedMonth}`);
                const matchesAccount = (selectedAccount === 'all' || t.account === selectedAccount);
                
                return matchesMonth && matchesAccount;
            });

            renderReport(filteredData);

        } catch (e) {
            console.error("Ошибка загрузки данных:", e);
        }
    }

    if (monthSelect) monthSelect.addEventListener('change', updateReportData);
    if (accountSelect) accountSelect.addEventListener('change', updateReportData);

    updateReportData();
});

function renderReport(data) {
    const categoriesDiv = document.getElementById('categoriesList');
    const pieChart = document.getElementById('pieChart');
    
    let income = 0;
    let expenses = 0;

    data.forEach(t => {
        if (t.amount > 0) income += t.amount;
        else expenses += t.amount;
    });

    document.getElementById('totalBalance').innerText = `${(income + expenses).toLocaleString()} ₽`;
    document.getElementById('totalIncome').innerText = `+${income.toLocaleString()} ₽`;
    document.getElementById('totalExpenses').innerText = `${expenses.toLocaleString()} ₽`;

    const expensesOnly = data.filter(t => t.amount < 0);
    
    if (expensesOnly.length === 0) {
        categoriesDiv.innerHTML = "<p class='text-muted text-center mt-3'>Нет расходов за этот период</p>";
        pieChart.style.background = "#233554";
        return;
    }

    const stats = {};
    let totalExp = 0;

    expensesOnly.forEach(t => {
        const amt = Math.abs(t.amount);
        stats[t.category] = (stats[t.category] || 0) + amt;
        totalExp += amt;
    });

    const colors = ['#6610f2', '#20c997', '#fd7e14', '#3b82f6', '#e83e8c', '#ffc107'];
    let colorIndex = 0;
    let gradientString = "";
    let currentAngle = 0;

    categoriesDiv.innerHTML = '<ul class="list-unstyled"></ul>';
    const ul = categoriesDiv.querySelector('ul');

    for (let category in stats) {
        const sum = stats[category];
        const percent = (sum / totalExp) * 100;
        const color = colors[colorIndex % colors.length];

        gradientString += `${color} ${currentAngle}% ${currentAngle + percent}%, `;
        currentAngle += percent;

        const li = document.createElement('li');
        li.className = 'mb-2 d-flex align-items-center';
        li.innerHTML = `
            <span style="width: 12px; height: 12px; background: ${color}; border-radius: 50%; display: inline-block; margin-right: 10px;"></span>
            ${category}: <b class="ms-1">${sum.toLocaleString()} ₽</b> <span class="ms-2 text-muted">(${percent.toFixed(0)}%)</span>
        `;
        ul.appendChild(li);
        
        colorIndex++;
    }

    pieChart.style.background = `conic-gradient(${gradientString.slice(0, -2)})`;
}