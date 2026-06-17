/* global Chart */
document.addEventListener('DOMContentLoaded', function() {
    const incomeAnalysisContainer = document.getElementById('incomeAnalysisBody');

    if (!incomeAnalysisContainer) return;

    let balanceChartInstance = null;
    const monthSelector = document.getElementById('reportMonth');
    const yearSelector = document.getElementById('reportYear');
    const applyFiltersButton = document.getElementById('applyReportFilters');

    const transactionsList = USERS.userData.transactions;
    const availableYears = [];

    transactionsList.forEach(function(transaction) {
        const transactionYear = parseInt(transaction.date.split('-')[0]);
        if (availableYears.indexOf(transactionYear) === -1) {
            availableYears.push(transactionYear);
        }
    });

    availableYears.sort();
    const currentYearValue = new Date().getFullYear();

    if (availableYears.length === 0) {
        yearSelector.innerHTML = `<option value="${currentYearValue}">${currentYearValue}</option>`;
    } else {
        yearSelector.innerHTML = availableYears.map(function(year) {
            return `<option value="${year}">${year}</option>`;
        }).join('');
    }

    const today = new Date();
    monthSelector.value = (today.getMonth() + 1).toString();
    yearSelector.value = currentYearValue.toString();

    function buildAnalyticsReport() {
        const selectedMonth = parseInt(monthSelector.value);
        const selectedYear = parseInt(yearSelector.value);
        const filteredTransactions = transactionsList.filter(function(transaction) {
            const dateParts = transaction.date.split('-');
            return parseInt(dateParts[0]) === selectedYear &&
                parseInt(dateParts[1]) === selectedMonth;
        });

        filteredTransactions.sort(function(first, second) {
            return new Date(first.date) - new Date(second.date);
        });

        const reportStatistics = {
            totalIncome: 0,
            totalExpense: 0,
            incomeByCategory: {},
            expenseByCategory: {}
        };

        filteredTransactions.forEach(function(transaction) {
            const amount = Math.abs(transaction.sum);
            const categoryName = transaction.category;

            if (transaction.sum > 0) {
                reportStatistics.totalIncome += amount;
                reportStatistics.incomeByCategory[categoryName] = (reportStatistics.incomeByCategory[categoryName] || 0) + amount;
            } else {
                reportStatistics.totalExpense += amount;
                reportStatistics.expenseByCategory[categoryName] = (reportStatistics.expenseByCategory[categoryName] || 0) + amount;
            }
        });

        const forecastDetails = document.getElementById('forecastDetails');
        const progressBar = document.getElementById('remainderProgressBar');
        const statusLabel = document.getElementById('statusLabel');

        if (filteredTransactions.length === 0) {
            forecastDetails.innerHTML = "ДАННЫХ НЕТ";
            progressBar.style.width = "0%";
            statusLabel.textContent = "АНАЛИЗ: ПУСТО";
            return;
        }

        const currentBalance = reportStatistics.totalIncome - reportStatistics.totalExpense;
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        let daysPassed = (selectedMonth === today.getMonth() + 1) ? today.getDate() : daysInMonth;
        if (daysPassed === 0) daysPassed = 1;

        const averageDailySpend = reportStatistics.totalExpense / daysPassed;
        const projectedExpense = averageDailySpend * daysInMonth;
        const projectedRemainder = reportStatistics.totalIncome - projectedExpense;

        forecastDetails.innerHTML = `
            ДОХОДЫ: <span class="text-income">${reportStatistics.totalIncome.toFixed(2)}</span><br>
            РАСХОДЫ: <span class="text-expense">${reportStatistics.totalExpense.toFixed(2)}</span><br>
            ИТОГ: <b>${currentBalance.toFixed(2)}</b><hr>
            ПРОГНОЗ ОСТАТКА: <br>
            <b class="${projectedRemainder >= 0 ? 'text-income' : 'text-expense'}">
                ${projectedRemainder.toFixed(2)} RUB
            </b>
        `;

        const percentage = reportStatistics.totalIncome > 0
            ? Math.max(0, Math.round((currentBalance / reportStatistics.totalIncome) * 100))
            : 0;

        progressBar.style.width = percentage + "%";
        progressBar.textContent = percentage + "%";
        progressBar.className = `progress-bar ${projectedRemainder >= 0 ? 'bg-income' : 'bg-expense'}`;
        statusLabel.textContent = `СТАТУС: ${projectedRemainder >= 0 ? 'НОРМА' : 'КРИТИЧНО'}`;
        statusLabel.className = projectedRemainder >= 0 ? 'text-income' : 'text-expense';

        function renderCategoryList(data, total, containerId, colorClass) {
            const container = document.getElementById(containerId);
            if (total === 0) {
                container.innerHTML = "[ ПУСТО ]";
                return;
            }
            container.innerHTML = Object.entries(data).map(function(entry) {
                const percent = Math.round((entry[1] / total) * 100);
                return `
                <div class="mb-2">
                    <span>${entry[0]}</span>
                    <div class="progress" style="height:20px;">
                        <div class="progress-bar ${colorClass}" style="width:${percent}%">${percent}%</div>
                    </div>
                </div>`;
            }).join('');
        }

        renderCategoryList(reportStatistics.incomeByCategory, reportStatistics.totalIncome, 'incomeAnalysisBody', 'bg-income');
        renderCategoryList(reportStatistics.expenseByCategory, reportStatistics.totalExpense, 'expenseAnalysisBody', 'bg-expense');

        const chartContext = document.getElementById('balanceChart').getContext('2d');
        if (balanceChartInstance) {
            balanceChartInstance.destroy();
        }

        let runningBalance = 0;
        balanceChartInstance = new Chart(chartContext, {
            type: 'line',
            data: {
                labels: filteredTransactions.map(t => t.date.split('-')[2]),
                datasets: [{
                    data: filteredTransactions.map(t => {
                        runningBalance += t.sum;
                        return runningBalance;
                    }),
                    borderColor: '#000',
                    stepped: true,
                    fill: false
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    applyFiltersButton.addEventListener('click', buildAnalyticsReport);
    buildAnalyticsReport();
});