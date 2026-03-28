function updateAvatarPanel() {
  const user = getUser()
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || '—'
  document.getElementById('avatar-name').textContent = name
  document.getElementById('avatar-email').textContent = user.email || '—'
}

async function loadUserData() {
  const user = getUser()
  document.getElementById('firstName').value = user.firstName || ''
  document.getElementById('lastName').value = user.lastName || ''
  document.getElementById('email').value = user.email || ''
  updateAvatarPanel()
}

async function saveSettings(event) {
  event.preventDefault()
  const user = getUser()
  const formData = new FormData(event.target)
  const data = {}
  formData.forEach((value, key) => data[key] = value)

  const response = await fetch(`${API}/users/${user.id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  })

  if (!response.ok) {
    document.getElementById('settings-error').classList.remove('d-none')
    return
  }

  const updated = await response.json()
  localStorage.user = JSON.stringify(updated)
  setUserName()
  updateAvatarPanel()

  const successEl = document.getElementById('settings-success')
  successEl.classList.remove('d-none')
  setTimeout(() => successEl.classList.add('d-none'), 3000)
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuth()
  setUserName()
  loadUserData()
  document.getElementById('settings-form').addEventListener('submit', saveSettings)
})
