document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();

    const filters = ['searchInput', 'categoryFilter', 'dateFilter', 'amountFilter'];
    filters.forEach(id => {
        document.getElementById(id).addEventListener('input', applyFilters);
    });

    document.getElementById('saveTransactionBtn').addEventListener('click', async () => {
        const amount = document.getElementById('addAmount').value;
        const desc = document.getElementById('addDescription').value;
        const cat = document.getElementById('addCategory').value;

        if (!amount || !desc) return alert("Заполните сумму и описание");

        const newTrans = {
            date: new Date().toLocaleDateString('ru-RU').slice(0, 5),
            description: desc,
            category: cat,
            account: "Карта",
            amount: parseFloat(amount)
        };

        await fetch('http://localhost:3000/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTrans)
        });
        location.reload(); 
    });
});

async function applyFilters() {
    const res = await fetch('http://localhost:3000/transactions');
    const data = await res.json();

    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const dateRange = document.getElementById('dateFilter').value;
    const amountRange = document.getElementById('amountFilter').value;

    const filtered = data.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchText);

        const matchesCategory = (category === 'all' || t.category === category);

        let matchesAmount = true;
        const absAmount = Math.abs(t.amount);
        if (amountRange === 'low') matchesAmount = absAmount < 1000;
        if (amountRange === 'mid') matchesAmount = absAmount >= 1000 && absAmount <= 5000;
        if (amountRange === 'high') matchesAmount = absAmount > 5000;

        let matchesDate = true;
        if (dateRange === 'this_month') matchesDate = t.date.includes('.03');
        if (dateRange === 'last_month') matchesDate = t.date.includes('.02');

        return matchesSearch && matchesCategory && matchesAmount && matchesDate;
    });

    renderTable(filtered);
}

async function loadTransactions() {
    const res = await fetch('http://localhost:3000/transactions');
    const data = await res.json();
    renderTable(data);
}

function renderTable(data) {
    const body = document.getElementById('transactionTableBody');
    body.innerHTML = '';
    data.forEach(t => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.tabIndex = 0;
        row.setAttribute('role', 'button');
        row.innerHTML = `
            <td class="p-3">${t.date}</td>
            <td class="p-3">${t.description}</td>
            <td class="p-3">${t.category}</td>
            <td class="p-3">Карта</td>
            <td class="p-3" style="color: ${t.amount < 0 ? 'var(--color-danger)' : 'var(--color-success)'}">${t.amount.toLocaleString()} ₽</td>
        `;

        row.addEventListener('click', () => {
            document.querySelector('#transModal .modal-title').innerText = 'Детали транзакции';
            document.querySelector('#transModal .modal-body').innerHTML = `
                <p><strong>Дата:</strong> ${t.date}</p>
                <p><strong>Описание:</strong> ${t.description}</p>
                <p><strong>Категория:</strong> ${t.category}</p>
                <p><strong>Сумма:</strong> <span style="color: ${t.amount < 0 ? 'var(--color-danger)' : 'var(--color-success)'}">${t.amount.toLocaleString()} ₽</span></p>
            `;

            const myModal = new bootstrap.Modal(document.getElementById('transModal'));
            myModal.show();
        });

        row.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                row.click();
            }
        });

        body.appendChild(row);
    });
}