async function loadReports() {
  const user = getUser()
  const response = await fetch(`${API}/transactions?userId=${user.id}`, { headers: authHeaders() })
  const transactions = await response.json()

  const expenses = transactions.filter(t => t.amount < 0)
  const incomes = transactions.filter(t => t.amount > 0)

  const categories = {}
  expenses.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount)
  })

  const chartColors = ['#6bc918', '#d4ee5e', '#5a9bd5', '#e8a838', '#dc3545', '#6c757d', '#a855f7', '#ec4899']

  new Chart(document.getElementById('categoryChart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: chartColors,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
      cutout: '60%'
    }
  })

  const now = new Date()
  const monthLabels = []
  const monthData = []
  const incomeData = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' })
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1)
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1)

    const expTotal = expenses
      .filter(t => { const td = new Date(t.date); return td >= monthStart && td < monthEnd })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const incTotal = incomes
      .filter(t => { const td = new Date(t.date); return td >= monthStart && td < monthEnd })
      .reduce((sum, t) => sum + t.amount, 0)

    monthLabels.push(label)
    monthData.push(expTotal)
    incomeData.push(incTotal)
  }

  new Chart(document.getElementById('expensesChart'), {
    type: 'bar',
    data: {
      labels: monthLabels,
      datasets: [
        { label: 'Расходы', data: monthData, backgroundColor: '#6bc918', borderRadius: 4 },
        { label: 'Доходы', data: incomeData, backgroundColor: '#d4ee5e', borderRadius: 4 }
      ]
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'top', labels: { font: { size: 11 } } } },
      scales: {
        y: { beginAtZero: true, ticks: { font: { size: 11 } } },
        x: { ticks: { font: { size: 11 } } }
      }
    }
  })

  const topCats = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 5)
  document.getElementById('top-categories').innerHTML = topCats.map(([cat, amount], i) => `
    <li class="d-flex justify-content-between align-items-center py-2 ${i < topCats.length - 1 ? 'border-bottom' : ''}">
      <span>${cat}</span>
      <span class="fw-medium">${amount.toLocaleString('ru-RU')} ₽</span>
    </li>
  `).join('')
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuth()
  setUserName()
  loadReports()
})
