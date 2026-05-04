const currentUserId = localStorage.getItem('mff_user_id');
if (!currentUserId) window.location.href = 'login.html';

let usdRate = 90;
let eurRate = 100;

function convertToRubles(amount, currency) {
    if (currency === '$') return amount * usdRate;
    if (currency === '€') return amount * eurRate;
    return amount;
}

async function loadDashboardData() {
    try {
        try {
            const cbrRes = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
            const cbrData = await cbrRes.json();

            usdRate = cbrData.Valute.USD.Value;
            const usdPrev = cbrData.Valute.USD.Previous;

            eurRate = cbrData.Valute.EUR.Value;
            const eurPrev = cbrData.Valute.EUR.Previous;

            const renderTrend = (elementId, current, prev) => {
                const el = document.getElementById(elementId);
                if (!el) return;

                if (current > prev) {
                    el.innerHTML = '<span class="text-success ms-1 trend-icon">▲</span>';
                } else if (current < prev) {
                    el.innerHTML = '<span class="text-danger ms-1 trend-icon">▼</span>';
                }
            };

            const usdEl = document.getElementById('usdRateDisplay');
            const eurEl = document.getElementById('eurRateDisplay');
            if(usdEl) usdEl.innerText = usdRate.toFixed(2);
            if(eurEl) eurEl.innerText = eurRate.toFixed(2);

            renderTrend('usdTrend', usdRate, usdPrev);
            renderTrend('eurTrend', eurRate, eurPrev);

        } catch (e) {
            console.warn('Не удалось загрузить живой курс', e);
        }

        const accRes = await fetch(`http://localhost:3000/accounts?userId=${currentUserId}`);
        const accounts = await accRes.json();

        let totalBalance = 0;
        accounts.forEach(acc => {
            totalBalance += convertToRubles(acc.balance, acc.currency);
        });

        document.getElementById('totalBalance').innerText = totalBalance.toLocaleString('ru-RU') + ' ₽';

        const transRes = await fetch(`http://localhost:3000/transactions?userId=${currentUserId}`);
        const transactions = await transRes.json();

        let totalIncomeSum = 0;
        let totalExpenseSum = 0;
        const incomeData = {};
        const expenseData = {};

        transactions.forEach(t => {
            const amountInRubles = convertToRubles(t.amount, t.currency || '₽');

            if (t.type === 'income') {
                totalIncomeSum += amountInRubles;
                incomeData[t.category] = (incomeData[t.category] || 0) + amountInRubles;
            } else if (t.type === 'expense') {
                totalExpenseSum += amountInRubles;
                expenseData[t.category] = (expenseData[t.category] || 0) + amountInRubles;
            }
        });

        document.getElementById('totalIncome').innerText = totalIncomeSum.toLocaleString('ru-RU') + ' ₽';
        document.getElementById('totalExpense').innerText = totalExpenseSum.toLocaleString('ru-RU') + ' ₽';

        const monthDifference = totalIncomeSum - totalExpenseSum;
        const diffSign = monthDifference >= 0 ? '+' : '';
        document.getElementById('monthDiff').innerText = `${diffSign} ${monthDifference.toLocaleString('ru-RU')} ₽ за этот месяц`;

        const recentContainer = document.getElementById('recentOps');
        if (recentContainer && transactions.length > 0) {
            recentContainer.innerHTML = '';

            const recentTx = transactions.slice(-4).reverse();

            recentTx.forEach(t => {
                const sign = t.type === 'expense' ? '-' : '+';
                const color = t.type === 'expense' ? 'text-danger' : 'text-success';

                recentContainer.innerHTML += `
        <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
            <div class="d-flex align-items-center gap-3">
                <div>
                    <h6 class="mb-0 fw-bold">${t.description || t.type}</h6>
                    <small class="text-muted">${t.date || 'Сегодня'} • ${t.category}</small>
                </div>
            </div>
            <div class="${color} fw-bold">${sign}${t.amount} ₽</div>
        </div>
    `;
            });
        }

        drawChart('incomeChart', incomeData, ['#c5a059', '#d4ba80', '#e3d4ab', '#f6f3dc']);
        drawChart('expensesChart', expenseData, ['#740707', '#a01c1c', '#cf4c4c', '#f1bcbc']);

    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function drawChart(canvasId, dataObject, colors) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    let sortedEntries = Object.entries(dataObject).sort((a, b) => b[1] - a[1]);

    let labels = [];
    let data = [];

    if (sortedEntries.length === 0) {
        labels = ['Нет данных'];
        data = [1];
        colors = ['#e9ecef'];
    } else {
        const top3 = sortedEntries.slice(0, 3);
        const others = sortedEntries.slice(3);

        labels = top3.map(item => item[0]);
        data = top3.map(item => item[1]);

        if (others.length > 0) {
            const othersSum = others.reduce((sum, item) => sum + item[1], 0);
            labels.push('Прочее');
            data.push(othersSum);
        }
    }

    const commonChartOptions = {
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    color: '#4a4a4a',
                    font: { size: 13, weight: 'bold' }
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{ data: data, backgroundColor: colors, borderWidth: 0 }]
        },
        options: commonChartOptions
    });
}

document.addEventListener('DOMContentLoaded', loadDashboardData);