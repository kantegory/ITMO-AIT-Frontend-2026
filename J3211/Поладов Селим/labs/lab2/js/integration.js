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
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuth()
  setUserName()
  loadRules()
})
