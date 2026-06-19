import { ref } from 'vue'

const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)

export function useAuth() {
  function login(user) {
    currentUser.value = user
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  return { currentUser, login, logout }
}
