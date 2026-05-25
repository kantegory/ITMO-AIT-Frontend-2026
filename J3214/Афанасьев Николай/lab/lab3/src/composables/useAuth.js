import { ref, computed } from 'vue'

const SESSION_KEY = 'session'

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null
  } catch {
    return null
  }
}

const session = ref(readSession())

export function useAuth() {
  const isLoggedIn = computed(() => session.value !== null)
  const isTeacher  = computed(() => session.value?.role === 'teacher')

  function setSession(user) {
    const s = {
      userId:    user.id,
      email:     user.email,
      role:      user.role,
      firstName: user.firstName,
      lastName:  user.lastName,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(s))
    session.value = s
    return s
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY)
    session.value = null
  }

  function getInitials() {
    const f = session.value?.firstName || ''
    const l = session.value?.lastName  || ''
    return (f.charAt(0) + l.charAt(0)).toUpperCase() || '??'
  }

  return { session, isLoggedIn, isTeacher, setSession, clearSession, getInitials }
}
