const SESSION_KEY = 'dataforge_session'

export function useAuth() {
  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
  }

  function setSession(user) {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        userId: user.id,
        token: `mock-token-${user.id}-${Date.now()}`,
      })
    )
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY)
  }

  return { getSession, setSession, clearSession }
}
