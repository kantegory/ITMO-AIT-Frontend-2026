let allTransactions = []

function renderTransactions(transactions) {
  const tbody = document.getElementById('transactions-tbody')
  if (!transactions.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">Транзакции не найдены</td></tr>'
    return
  }
  tbody.innerHTML = transactions.map(t => {
    const emoji = CATEGORY_EMOJI[t.category] || '💳'
    const amountClass = t.amount < 0 ? 'amount-negative' : 'text-success'
    const amountStr = t.amount < 0
      ? `− ${Math.abs(t.amount).toLocaleString('ru-RU')} ₽`
      : `+ ${t.amount.toLocaleString('ru-RU')} ₽`
    const date = new Date(t.date).toLocaleString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    return `<tr>
      <td>
        <div class="d-flex align-items-center gap-2">
          <span class="transaction-icon rounded d-inline-flex align-items-center justify-content-center flex-shrink-0" style="width:36px;height:36px">${emoji}</span>
          <div>
            <span class="fw-medium">${t.name}</span><br>
            <span class="small text-muted">${t.counterparty || ''}</span>
          </div>
        </div>
      </td>
      <td><span class="transaction-badge badge">${t.category}</span></td>
      <td class="${amountClass}">${amountStr}</td>
      <td>${date}</td>
      <td>${t.accountId || '—'}</td>
      <td><button type="button" class="btn btn-view btn-sm" onclick="openModal(${t.id})">Просмотр</button></td>
    </tr>`
  }).join('')
}

async function loadTransactions() {
  const user = getUser()
  const search = document.getElementById('search-input').value
  const category = document.getElementById('category-filter').value

  let url = `${API}/transactions?userId=${user.id}&_sort=date&_order=desc`
  if (search) url += `&name_like=${encodeURIComponent(search)}`
  if (category) url += `&category=${encodeURIComponent(category)}`

  const response = await fetch(url, { headers: authHeaders() })
  let transactions = await response.json()
  allTransactions = transactions

  const amountFrom = Number(document.getElementById('amount-from').value)
  const dateFrom = document.getElementById('date-from').value
  const dateTo = document.getElementById('date-to').value

  if (amountFrom) {
    transactions = transactions.filter(t => Math.abs(t.amount) >= amountFrom)
  }
  if (dateFrom) {
    transactions = transactions.filter(t => new Date(t.date) >= new Date(dateFrom))
  }
  if (dateTo) {
    transactions = transactions.filter(t => new Date(t.date) <= new Date(dateTo + 'T23:59:59'))
  }

  renderTransactions(transactions)
}

function openModal(id) {
  const t = allTransactions.find(t => t.id === id)
  if (!t) return
  document.getElementById('modal-name').textContent = t.name
  document.getElementById('modal-counterparty').textContent = t.counterparty || '—'
  document.getElementById('modal-category').textContent = t.category
  const amountStr = t.amount < 0
    ? `− ${Math.abs(t.amount).toLocaleString('ru-RU')} ₽`
    : `+ ${t.amount.toLocaleString('ru-RU')} ₽`
  document.getElementById('modal-amount').textContent = amountStr
  document.getElementById('modal-date').textContent = new Date(t.date).toLocaleString('ru-RU')
  document.getElementById('modal-account').textContent = t.accountId || '—'
  new bootstrap.Modal(document.getElementById('transactionModal')).show()
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuth()
  setUserName()
  loadTransactions()
  document.getElementById('search-input').addEventListener('input', loadTransactions)
  document.getElementById('category-filter').addEventListener('change', loadTransactions)
  document.getElementById('amount-from').addEventListener('input', loadTransactions)
  document.getElementById('date-from').addEventListener('change', loadTransactions)
  document.getElementById('date-to').addEventListener('change', loadTransactions)
})
