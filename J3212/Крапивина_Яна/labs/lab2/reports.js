document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('updateBtn').addEventListener('click', () => {
        location.reload();
    });

    try {
        const response = await fetch('http://localhost:3000/transactions');
        const transactions = await response.json();

        renderReport(transactions);
    } catch (e) {
        console.error("Ошибка загрузки:", e);
    }
});

function renderReport(data) {
    let income = 0;
    let expenses = 0;

    data.forEach(t => {
        if (t.amount > 0) income += t.amount;
        else expenses += t.amount;
    });

    document.getElementById('totalBalance').innerText = `${(income + expenses).toLocaleString()} ₽`;
    document.getElementById('totalIncome').innerText = `+${income.toLocaleString()} ₽`;
    document.getElementById('totalExpenses').innerText = `${expenses.toLocaleString()} ₽`;

    const categoriesDiv = document.getElementById('categoriesList');
    const expensesOnly = data.filter(t => t.amount < 0);
    
    const stats = {};
    let totalExp = 0;

    expensesOnly.forEach(t => {
        const amt = Math.abs(t.amount);
        stats[t.category] = (stats[t.category] || 0) + amt;
        totalExp += amt;
    });

    categoriesDiv.innerHTML = '<ul class="list-unstyled"></ul>';
    const ul = categoriesDiv.querySelector('ul');

    for (let category in stats) {
        const sum = stats[category];
        const percent = ((sum / totalExp) * 100).toFixed(0);
        
        const li = document.createElement('li');
        li.className = 'mb-2';
        li.innerHTML = `• ${category}: <b>${sum.toLocaleString()} ₽</b> (${percent}%)`;
        ul.appendChild(li);
    }
}