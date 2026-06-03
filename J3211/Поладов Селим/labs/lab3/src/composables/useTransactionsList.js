import { ref, reactive, watch } from 'vue'
import { transactionsApi } from '../api/resources.js'
import { useAuth } from './useAuth.js'

export function useTransactionsList() {
  const { user } = useAuth()
  const filters = reactive({
    q: '',
    category: '',
    amountFrom: '',
    dateFrom: '',
    dateTo: ''
  })
  const items = ref([])
  const loading = ref(false)

  function buildBase() {
    const params = {
      userId: user.value.id,
      _sort: 'date',
      _order: 'desc'
    }
    if (filters.q) params.q = filters.q
    if (filters.category) params.category = filters.category
    if (filters.dateFrom) params.date_gte = filters.dateFrom
    if (filters.dateTo) params.date_lte = `${filters.dateTo}T23:59:59`
    return params
  }

  async function load() {
    loading.value = true
    try {
      const base = buildBase()
      if (filters.amountFrom) {
        const n = Number(filters.amountFrom)
        const [income, expense] = await Promise.all([
          transactionsApi.list({ ...base, amount_gte: n }),
          transactionsApi.list({ ...base, amount_lte: -n })
        ])
        items.value = [...income, ...expense].sort((a, b) => b.date.localeCompare(a.date))
      } else {
        items.value = await transactionsApi.list(base)
      }
    } finally {
      loading.value = false
    }
  }

  watch(filters, load)
  return { filters, items, loading, load }
}
