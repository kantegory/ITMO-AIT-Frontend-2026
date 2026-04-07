document.addEventListener('DOMContentLoaded', async () => {
    refreshAllData();

    const saveRuleBtn = document.getElementById('saveRuleBtn');
    if (saveRuleBtn) {
        saveRuleBtn.addEventListener('click', async () => {
            const keyword = document.getElementById('ruleKeyword').value;
            const category = document.getElementById('ruleCategory').value;

            if (!keyword) return alert("Введите ключевое слово!");

            const newRule = { keyword, category };
            
            await fetch('http://localhost:3000/rules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRule)
            });
            
            refreshAllData();
        });
    }

    document.querySelectorAll('.btn-select-bank').forEach(btn => {
        btn.addEventListener('click', async () => {
            const bankName = btn.innerText.trim();
            const newAcc = { name: bankName, status: "Подключено", color: "success" };

            await fetch('http://localhost:3000/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAcc)
            });
            refreshAllData();
        });
    });

    const startImportBtn = document.getElementById('startImportBtn');
    if (startImportBtn) {
        startImportBtn.addEventListener('click', async () => {
            const fakeData = {
                date: new Date().toLocaleDateString('ru-RU').slice(0, 5),
                description: "Импорт: Продукты",
                category: "Продукты",
                account: "Импорт",
                amount: -1200
            };

            await fetch('http://localhost:3000/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fakeData)
            });
            window.location.href = 'transactions.html'; 
        });
    }
});

async function refreshAllData() {
    try {
        const resAcc = await fetch('http://localhost:3000/accounts');
        const accounts = await resAcc.json();
        renderAccounts(accounts);

        const resRules = await fetch('http://localhost:3000/rules');
        const rules = await resRules.json();
        renderRules(rules);

    } catch (e) {
        console.error("Ошибка при обновлении данных:", e);
    }
}

function renderAccounts(data) {
    const list = document.getElementById('accountsList');
    if (!list) return;
    list.innerHTML = '';
    data.forEach(acc => {
        list.innerHTML += `
            <div class="d-flex justify-content-between align-items-center border-bottom border-secondary py-3">
                <div>
                    <strong class="text-white">${acc.name}</strong><br>
                    <small class="text-${acc.color}">${acc.status}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteAccount(${acc.id})">Отключить</button>
            </div>`;
    });
}

function renderRules(data) {
    const rulesTable = document.querySelector('.table-custom tbody');
    if (!rulesTable) return;
    rulesTable.innerHTML = '';
    data.forEach(rule => {
        rulesTable.innerHTML += `
            <tr>
                <td class="p-3">${rule.keyword}</td>
                <td class="p-3">${rule.category}</td>
            </tr>`;
    });
}

async function deleteAccount(id) {
    if (confirm('Отключить этот банк?')) {
        await fetch(`http://localhost:3000/accounts/${id}`, { method: 'DELETE' });
        refreshAllData();
    }
}