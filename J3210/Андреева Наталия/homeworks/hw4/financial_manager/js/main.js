document.addEventListener("DOMContentLoaded", async () => {
    await updateUI();
    if (document.getElementById('rate-usd')) fetchCurrencyRates();

    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const cat = document.getElementById('catInput').value;
            const date = document.getElementById('dateInput').value;
            const sum = parseFloat(document.getElementById('sumInput').value);
            const type = document.getElementById('typeInput').value;
            const userId = localStorage.getItem('currentUserId');

            if (!cat || !date || isNaN(sum)) {
                return alert("Заполните поля!");
            }

            await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId: userId.toString(), cat, date, sum, type})
            });
            location.reload();
        });
    }
});

async function importTransactions() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    const uId = user.id.toString();

    if (confirm("Выполнить синхронизацию с банком?")) {
        const rules = JSON.parse(localStorage.getItem('bankRules_' + uId) || "[]");
        const rawData = [{desc: "Yandex Go", sum: 450, type: "minus"}, {desc: "Starbucks", sum: 320, type: "minus"}];
        const finalData = rawData.map(item => {
            const rule = rules.find(r => item.desc.toLowerCase().includes(r.keyword.toLowerCase()));
            return {
                userId: uId,
                cat: rule ? rule.category : "Разное",
                sum: item.sum,
                type: item.type,
                date: new Date().toISOString().split('T')[0]
            };
        });

        for (const trans of finalData) {
            await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(trans)
            });
        }
        localStorage.setItem('bankConnected_' + uId, 'true');
        alert("Импорт завершен!");
        location.reload();
    }
}