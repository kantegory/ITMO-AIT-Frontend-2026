const API = 'http://localhost:3000'

function checkAuth() {
  if (localStorage.accessToken) {
    window.location.href = 'dashboard.html'
  }
}

async function login(event) {
  event.preventDefault()
  const formData = new FormData(event.target)
  const loginData = {}
  formData.forEach((value, key) => loginData[key] = value)

  const response = await fetch(`${API}/login`, {
    method: 'POST',
    body: JSON.stringify(loginData),
    headers: { 'Content-Type': 'application/json' }
  })

  if (!response.ok) {
    document.getElementById('login-error').classList.remove('d-none')
    return
  }

  const { accessToken, user } = await response.json()
  localStorage.accessToken = accessToken
  localStorage.user = JSON.stringify(user)
  window.location.href = 'dashboard.html'
}

document.addEventListener('DOMContentLoaded', () => checkAuth())
