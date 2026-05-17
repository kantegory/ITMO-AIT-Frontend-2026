const API = 'http://localhost:3000'

const CATEGORY_EMOJI = {
  'Продукты': '🛒', 'Транспорт': '🚗', 'Развлечения': '🎬',
  'Доход': '💵', 'Крупная покупка': '🚘', 'Авто': '🚗',
  'Жильё': '🏠', 'Крупные траты': '💰', 'Техника': '💻', 'Накопления': '🏦'
}

function getUser() {
  return JSON.parse(localStorage.user || '{}')
}

function authHeaders() {
  return { 'Authorization': 'Bearer ' + localStorage.accessToken }
}

function checkAuth() {
  if (!localStorage.accessToken) {
    window.location.href = 'login.html'
  }
}

function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
  window.location.href = 'login.html'
}

function setUserName() {
  const user = getUser()
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || ''
  document.getElementById('user-name').textContent = name
}
