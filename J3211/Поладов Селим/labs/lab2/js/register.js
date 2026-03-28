const API = 'http://localhost:3000'

function checkAuth() {
  if (localStorage.accessToken) {
    window.location.href = 'dashboard.html'
  }
}

async function register(event) {
  event.preventDefault()
  const formData = new FormData(event.target)
  const data = {}
  formData.forEach((value, key) => data[key] = value)

  const response = await fetch(`${API}/register`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })

  if (!response.ok) {
    document.getElementById('register-error').classList.remove('d-none')
    return
  }

  const { accessToken, user } = await response.json()
  localStorage.accessToken = accessToken
  localStorage.user = JSON.stringify(user)
  window.location.href = 'dashboard.html'
}

document.addEventListener('DOMContentLoaded', () => checkAuth())
