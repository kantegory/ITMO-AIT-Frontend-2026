async function loadSummary() {
  const user = getUser()
  const [accountsRes, transactionsRes] = await Promise.all([
    fetch(`${API}/accounts?userId=${user.id}`, { headers: authHeaders() }),
    fetch(`${API}/transactions?userId=${user.id}`, { headers: authHeaders() })
  ])
  const accounts = await accountsRes.json()
  const transactions = await transactionsRes.json()

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)

  const now = new Date()
  const monthExpenses = transactions
    .filter(t => {
      const d = new Date(t.date)
      return t.amount < 0 && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const savingsAccount = accounts.find(a => a.name === 'Накопительный')
  const savings = savingsAccount ? savingsAccount.balance : 0

  document.getElementById('total-balance').textContent = totalBalance.toLocaleString('ru-RU') + ' ₽'
  document.getElementById('monthly-expenses').textContent = monthExpenses.toLocaleString('ru-RU') + ' ₽'
  document.getElementById('savings').textContent = savings.toLocaleString('ru-RU') + ' ₽'

  document.getElementById('accounts-list').innerHTML = accounts.map(a => `
    <li class="d-flex justify-content-between align-items-center py-2 border-bottom">
      <div>
        <div class="fw-medium">${a.name}</div>
        <div class="small text-muted">${a.currency}</div>
      </div>
      <div class="fw-bold">${a.balance.toLocaleString('ru-RU')} ₽</div>
    </li>
  `).join('')
}

async function loadRecentTransactions() {
  const user = getUser()
  const response = await fetch(
    `${API}/transactions?userId=${user.id}&_sort=date&_order=desc&_limit=5`,
    { headers: authHeaders() }
  )
  const transactions = await response.json()

  const tbody = document.getElementById('recent-tbody')
  if (!transactions.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">Нет транзакций</td></tr>'
    return
  }

  tbody.innerHTML = transactions.map(t => {
    const emoji = CATEGORY_EMOJI[t.category] || '💳'
    const amountClass = t.amount < 0 ? 'amount-negative' : 'text-success'
    const amountStr = t.amount < 0
      ? `− ${Math.abs(t.amount).toLocaleString('ru-RU')} ₽`
      : `+ ${t.amount.toLocaleString('ru-RU')} ₽`
    const date = new Date(t.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
    return `<tr>
      <td><span class="rounded bg-light d-inline-flex align-items-center justify-content-center me-2" style="width:36px;height:36px">${emoji}</span> ${t.name}</td>
      <td><span class="badge bg-light text-dark">${t.category}</span></td>
      <td class="${amountClass}">${amountStr}</td>
      <td>${date}</td>
    </tr>`
  }).join('')
}

async function loadCurrencyRates() {
  const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json')
  const data = await response.json()
  const usdRub = data.usd.rub
  const eurRub = data.usd.rub / data.usd.eur
  document.getElementById('usd-rub').textContent = usdRub.toFixed(2)
  document.getElementById('eur-rub').textContent = eurRub.toFixed(2)
  document.getElementById('rates-date').textContent = 'на ' + data.date
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuth()
  setUserName()
  loadSummary()
  loadRecentTransactions()
  loadCurrencyRates()
})
