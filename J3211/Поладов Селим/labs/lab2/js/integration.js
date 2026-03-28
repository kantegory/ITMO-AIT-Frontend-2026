async function loadRules() {
  const user = getUser()
  const response = await fetch(`${API}/rules?userId=${user.id}`, { headers: authHeaders() })
  const rules = await response.json()

  const tbody = document.getElementById('rules-tbody')
  if (!rules.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">Правила не настроены</td></tr>'
    return
  }
  tbody.innerHTML = rules.map(r => `
    <tr>
      <td>${r.condition} «${r.value}»</td>
      <td><span class="badge bg-light text-dark">${r.category}</span></td>
      <td>${r.action}</td>
      <td><button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteRule(${r.id})">Удалить</button></td>
    </tr>
  `).join('')
}

async function saveRule(event) {
  event.preventDefault()
  const user = getUser()
  const formData = new FormData(event.target)
  const data = {}
  formData.forEach((value, key) => data[key] = value)
  data.userId = user.id
  data.action = 'Присвоить категорию'

  await fetch(`${API}/rules`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  })

  bootstrap.Modal.getInstance(document.getElementById('ruleModal')).hide()
  event.target.reset()
  loadRules()
}

async function deleteRule(id) {
  await fetch(`${API}/rules/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  loadRules()
}

async function addTransaction(event) {
  event.preventDefault()
  const user = getUser()
  const formData = new FormData(event.target)
  const data = {}
  formData.forEach((value, key) => data[key] = value)

  data.userId = user.id
  data.amount = data.category === 'Доход' ? Number(data.amount) : -Number(data.amount)
  data.date = new Date().toISOString()
  data.counterparty = data.counterparty || 'Ручной ввод'
  data.accountId = 1

  await fetch(`${API}/transactions`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  })

  bootstrap.Modal.getInstance(document.getElementById('manualModal')).hide()
  event.target.reset()

  const toast = document.getElementById('transaction-toast')
  toast.classList.remove('d-none')
  setTimeout(() => toast.classList.add('d-none'), 3000)
}

async function loadBanks() {
  const user = getUser()
  const response = await fetch(`${API}/banks?userId=${user.id}`, { headers: authHeaders() })
  const banks = await response.json()

  const container = document.getElementById('banks-list')
  if (!banks.length) {
    container.innerHTML = '<p class="text-muted small mb-0">Нет подключённых банков</p>'
    return
  }
  container.innerHTML = banks.map(b => `
    <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
      <div>
        <span class="fw-medium">${b.name}</span>
        <span class="small text-muted ms-2">подключён ${new Date(b.connectedAt).toLocaleDateString('ru-RU')}</span>
      </div>
      <button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteBank(${b.id})">Отключить</button>
    </div>
  `).join('')
}

async function connectBank(event) {
  event.preventDefault()
  const user = getUser()
  const select = document.getElementById('bank-select')
  const agree = document.getElementById('bankAgree')

  if (!agree.checked) {
    document.getElementById('bank-agree-error').classList.remove('d-none')
    return
  }
  document.getElementById('bank-agree-error').classList.add('d-none')

  await fetch(`${API}/banks`, {
    method: 'POST',
    body: JSON.stringify({ userId: user.id, name: select.value, connectedAt: new Date().toISOString() }),
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  })

  bootstrap.Modal.getInstance(document.getElementById('bankModal')).hide()
  agree.checked = false
  loadBanks()
}

async function deleteBank(id) {
  await fetch(`${API}/banks/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  loadBanks()
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuth()
  setUserName()
  loadRules()
  loadBanks()
  document.getElementById('bank-connect-form').addEventListener('submit', connectBank)
})
