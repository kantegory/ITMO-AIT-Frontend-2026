export const SESSION_KEY = 'moneyflow_user'
export const THEME_STORAGE_KEY = 'moneyflow-theme'

export function formatMoney(value) {
  return `₽ ${Number(value || 0).toLocaleString('ru-RU')}`
}

export function sameUserId(recordUserId, currentUserId) {
  return String(recordUserId) === String(currentUserId)
}

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

export function groupExpensesByMonth(transactions) {
  const monthMap = new Map()

  transactions
    .filter((item) => item.type === 'expense')
    .forEach((item) => {
      const monthKey = item.date.slice(0, 7)
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + Number(item.amount))
    })

  return [...monthMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
}

export function categoryExpensesForCurrentMonth(transactions) {
  const nowMonth = new Date().toISOString().slice(0, 7)
  const totals = {}

  transactions
    .filter((item) => item.type === 'expense' && item.date.startsWith(nowMonth))
    .forEach((item) => {
      totals[item.category] = (totals[item.category] || 0) + Number(item.amount)
    })

  return totals
}

export function calculateForecast(monthlyExpenses) {
  if (!monthlyExpenses.length) return 0

  const lastThree = monthlyExpenses.slice(-3)
  const total = lastThree.reduce((sum, [, value]) => sum + value, 0)

  return Math.round(total / lastThree.length)
}
