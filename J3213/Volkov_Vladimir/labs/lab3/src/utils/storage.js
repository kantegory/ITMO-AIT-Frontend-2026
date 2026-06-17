export function readJsonStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (error) {
    return fallback
  }
}

export function saveJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
