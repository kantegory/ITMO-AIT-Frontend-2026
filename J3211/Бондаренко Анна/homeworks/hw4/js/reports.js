/* global Chart */
window.initReportsPage = function () {
    const box = document.getElementById('incomeAnalysisBody');
    if (!box) {
        return;
    }

    let chart = null;
    const monthSelect = document.getElementById('reportMonth');
    const yearSelect = document.getElementById('reportYear');
    const applyBtn = document.getElementById('applyReportFilters');
    const transactions = window.USERS.userData.transactions;
    const years = [];

    transactions.forEach(function (tx) {
        const txYear = parseInt(tx.date.split('-')[0]);
        if (years.indexOf(txYear) === -1) {
            years.push(txYear);
        }
    });

    years.sort();
    const currentYear = new Date().getFullYear();

    if (years.length === 0) {
        yearSelect.innerHTML = `<option value="${currentYear}">${currentYear}</option>`;
    } else {
        yearSelect.innerHTML = years.map(function (y) {
            return `<option value="${y}">${y}</option>`;
        }).join('');
    }

    const today = new Date();
    monthSelect.value = (today.getMonth() + 1).toString();
    yearSelect.value = currentYear.toString();

    function buildReport() {
        const selMonth = parseInt(monthSelect.value);
        const selYear = parseInt(yearSelect.value);

        const filtered = transactions.filter(function (tx) {
            const parts = tx.date.split('-');
            return (parseInt(parts[0]) === selYear && parseInt(parts[1]) === selMonth);
        });

        filtered.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        });

        const stats = {
            income: 0, expense: 0, incByCat: {}, expByCat: {}
        };

        filtered.forEach(function (tx) {
            const amount = Math.abs(tx.sum);
            const cat = tx.category;

            if (tx.sum > 0) {
                stats.income += amount;
                stats.incByCat[cat] = (stats.incByCat[cat] || 0) + amount;
            } else {
                stats.expense += amount;
                stats.expByCat[cat] = (stats.expByCat[cat] || 0) + amount;
            }
        });

        const details = document.getElementById('forecastDetails');
        const bar = document.getElementById('remainderProgressBar');
        const status = document.getElementById('statusLabel');

        if (filtered.length === 0) {
            details.innerHTML = "ДАННЫХ НЕТ";
            bar.style.width = "0%";
            status.textContent = "АНАЛИЗ: ПУСТО";

            if (chart) {
                chart.destroy();
            }

            document.getElementById('incomeAnalysisBody').innerHTML = "";
            document.getElementById('expenseAnalysisBody').innerHTML = "";

            return;
        }

        const balance = stats.income - stats.expense;
        const daysInMonth = new Date(selYear, selMonth, 0).getDate();

        let daysPassed;
        if (selMonth === today.getMonth() + 1) {
            daysPassed = today.getDate()
        } else {
            daysPassed = daysInMonth;
        }

        const avgDaily = stats.expense / daysPassed;
        const projExp = avgDaily * daysInMonth;
        let projRem = stats.income - projExp;

        if (selMonth === today.getMonth() + 1 && today.getDate() < 3 && projRem < 0) {
            projRem = stats.income - stats.expense;
        }

        details.innerHTML = `
            ДОХОДЫ: <span class="text-income">${stats.income.toFixed(2)}</span><br>
            РАСХОДЫ: <span class="text-expense">${stats.expense.toFixed(2)}</span><br>
            ИТОГ: <b>${balance.toFixed(2)}</b><hr>
            ПРОГНОЗ ОСТАТКА: <br>
            <b class="${projRem >= 0 ? 'text-income' : 'text-expense'}">
                ${projRem.toFixed(2)} RUB
            </b>
        `;

        const percent = stats.income > 0 ? Math.max(0, Math.round((balance / stats.income) * 100)) : 0;

        bar.style.width = percent + "%";
        bar.textContent = percent + "%";
        bar.className = `progress-bar ${projRem >= 0 ? 'bg-income' : 'bg-expense'}`;
        status.textContent = `СТАТУС: ${projRem >= 0 ? 'НОРМА' : 'КРИТИЧНО'}`;
        status.className = projRem >= 0 ? 'text-income' : 'text-expense';

        function renderList(data, total, id, cls) {
            const el = document.getElementById(id);
            if (total === 0) {
                el.innerHTML = "[ ПУСТО ]";
                return;
            }
            el.innerHTML = Object.entries(data).map(function (item) {
                const p = Math.round((item[1] / total) * 100);
                return `
                    <div class="mb-2">
                        <span>${item[0]}</span>
                        <div class="progress" style="height:20px;">
                            <div class="progress-bar ${cls}" style="width:${p}%">${p}%</div>
                        </div>
                    </div>`;
            }).join('');
        }

        renderList(stats.incByCat, stats.income, 'incomeAnalysisBody', 'bg-income');
        renderList(stats.expByCat, stats.expense, 'expenseAnalysisBody', 'bg-expense');

        const getThemeColor = (varName) => {
            return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        };
        const ctx = document.getElementById('balanceChart').getContext('2d');

        if (chart) {
            chart.destroy();
        }

        let runSum = 0;

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: filtered.map(function (tx) {
                    return tx.date.split('-')[2];
                }),
                datasets: [{
                    data: filtered.map(function (tx) {
                        runSum += tx.sum;
                        return runSum;
                    }),
                    borderColor: getThemeColor('--border-color'),
                    stepped: true,
                    fill: false,
                    pointBackgroundColor: getThemeColor('--border-color')
                }]
            }, options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {display: false}
                },
                scales: {
                    y: {
                        ticks: {color: getThemeColor('--border-color')},
                        grid: {color: 'rgba(72, 187, 120, 0.1)'}
                    },
                    x: {
                        ticks: {color: getThemeColor('--border-color')},
                        grid: {display: false}
                    }
                }
            }
        });
    }

    applyBtn.addEventListener('click', buildReport);
    buildReport();
};