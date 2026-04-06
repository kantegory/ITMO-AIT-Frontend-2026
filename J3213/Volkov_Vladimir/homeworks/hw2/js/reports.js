let expensesChartInstance = null;
let categoryChartInstance = null;

function groupExpensesByMonth(transactions) {
  const monthMap = new Map();

  transactions
    .filter((item) => item.type === 'expense')
    .forEach((item) => {
      const monthKey = item.date.slice(0, 7);
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + Number(item.amount));
    });

  return [...monthMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6);
}

function categoryExpensesForCurrentMonth(transactions) {
  const nowMonth = new Date().toISOString().slice(0, 7);
  const totals = {};

  transactions
    .filter((item) => item.type === 'expense' && item.date.startsWith(nowMonth))
    .forEach((item) => {
      totals[item.category] = (totals[item.category] || 0) + Number(item.amount);
    });

  return totals;
}

function calculateForecast(monthlyExpenses) {
  if (!monthlyExpenses.length) return 0;

  const lastThree = monthlyExpenses.slice(-3);
  const sum = lastThree.reduce((acc, [, value]) => acc + value, 0);

  return Math.round(sum / lastThree.length);
}

function isCurrentUserTransaction(record, userId) {
  return String(record.userId) === String(userId);
}

async function initReportsPage() {
  const user = requireAuth();
  if (!user) return;

  try {
    const allTransactions = await apiRequest('/transactions');

    const transactions = allTransactions
      .filter((item) => isCurrentUserTransaction(item, user.id))
      .sort((a, b) => a.date.localeCompare(b.date));

    const expenseTransactions = transactions.filter((item) => item.type === 'expense');

    const monthlyExpenses = groupExpensesByMonth(transactions);
    const monthlyLabels = monthlyExpenses.map(([month]) => {
      const [year, monthNumber] = month.split('-');
      return `${monthNumber}.${year.slice(2)}`;
    });
    const monthlyValues = monthlyExpenses.map(([, value]) => value);

    const categoryMap = categoryExpensesForCurrentMonth(transactions);
    const categories = Object.keys(categoryMap);
    const categoryValues = Object.values(categoryMap);

    const forecast = calculateForecast(monthlyExpenses);
    const avgCheck = expenseTransactions.length
      ? Math.round(
          expenseTransactions.reduce((sum, item) => sum + Number(item.amount), 0) /
          expenseTransactions.length
        )
      : 0;

    const maxExpense = expenseTransactions.length
      ? Math.max(...expenseTransactions.map((item) => Number(item.amount)))
      : 0;

    document.getElementById('forecastValue').textContent = `Прогноз: ${formatMoney(forecast)}`;
    document.getElementById('avgCheckValue').textContent = formatMoney(avgCheck);
    document.getElementById('maxExpenseValue').textContent = formatMoney(maxExpense);
    document.getElementById('operationsCountValue').textContent = String(transactions.length);

    const expensesCanvas = document.getElementById('expensesChart');

    if (expensesCanvas && typeof Chart !== 'undefined') {
      expensesChartInstance?.destroy();

      expensesChartInstance = new Chart(expensesCanvas, {
        type: 'line',
        data: {
          labels: monthlyLabels,
          datasets: [{
            label: 'Расходы',
            data: monthlyValues,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37,99,235,0.08)',
            fill: true,
            tension: 0.35
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } }
        }
      });
    }

    const categoryCanvas = document.getElementById('categoryChart');

    if (categoryCanvas && typeof Chart !== 'undefined') {
      categoryChartInstance?.destroy();

      categoryChartInstance = new Chart(categoryCanvas, {
        type: 'doughnut',
        data: {
          labels: categories,
          datasets: [{
            data: categoryValues,
            backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
    showToast('Не удалось загрузить отчёты');
  }
}