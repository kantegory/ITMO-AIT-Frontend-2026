import { ref } from 'vue'
import { transactionsApi } from '../api/resources.js'
import { useAuth } from './useAuth.js'

export function useReportsData(monthsBack = 6) {
  const { user } = useAuth()
  const expenses = ref([])
  const incomes = ref([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      const since = new Date()
      since.setMonth(since.getMonth() - (monthsBack - 1))
      since.setDate(1)
      since.setHours(0, 0, 0, 0)
      const dateGte = since.toISOString()

      const baseParams = { userId: user.value.id, date_gte: dateGte }
      const [exp, inc] = await Promise.all([
        transactionsApi.list({ ...baseParams, amount_lte: -1 }),
        transactionsApi.list({ ...baseParams, amount_gte: 1 })
      ])
      expenses.value = exp
      incomes.value = inc
    } finally {
      loading.value = false
    }
  }

  function groupByCategory(list) {
    const map = {}
    for (const t of list) map[t.category] = (map[t.category] || 0) + Math.abs(t.amount)
    return map
  }

  function groupByMonth(list, months) {
    const totals = new Array(months.length).fill(0)
    for (const t of list) {
      const d = new Date(t.date)
      const idx = months.findIndex(m => m.year === d.getFullYear() && m.month === d.getMonth())
      if (idx >= 0) totals[idx] += Math.abs(t.amount)
    }
    return totals
  }

  function buildMonths() {
    const now = new Date()
    const result = []
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      result.push({ year: d.getFullYear(), month: d.getMonth(), date: d })
    }
    return result
  }

  return { expenses, incomes, loading, load, groupByCategory, groupByMonth, buildMonths }
}
