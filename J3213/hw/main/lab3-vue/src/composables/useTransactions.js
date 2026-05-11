import { computed, ref } from 'vue'
import { getCollection, postCollection } from '../services/api'
import { useAuth } from './useAuth'

const accounts = ref([])
const budgets = ref([])
const transactions = ref([])
const loading = ref(false)

function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.date) - new Date(a.date))
}

function normalizeNumber(value) {
  return value === '' || value === null || value === undefined ? null : Number(value)
}

export function useTransactions() {
  const { currentUser } = useAuth()

  const loadAll = async () => {
    if (!currentUser.value) return
    loading.value = true

    try {
      const [allAccounts, allBudgets, allTransactions] = await Promise.all([
        getCollection('accounts'),
        getCollection('budgets'),
        getCollection('transactions'),
      ])

      accounts.value = allAccounts.filter((item) => Number(item.userId) === Number(currentUser.value.id))
      budgets.value = allBudgets.filter((item) => Number(item.userId) === Number(currentUser.value.id))
      transactions.value = sortByDateDesc(allTransactions.filter((item) => Number(item.userId) === Number(currentUser.value.id)))
    } finally {
      loading.value = false
    }
  }

  const summary = computed(() => {
    const income = transactions.value.filter((item) => item.type === 'income').reduce((sum, item) => sum + Number(item.amount), 0)
    const expense = transactions.value.filter((item) => item.type === 'expense').reduce((sum, item) => sum + Number(item.amount), 0)
    return {
      income,
      expense,
      net: income - expense,
    }
  })

  const categories = computed(() => {
    return [...new Set(transactions.value.map((item) => item.category))].sort((a, b) => a.localeCompare(b, 'ru'))
  })

  const report = computed(() => {
    const expenseRows = transactions.value.filter((item) => item.type === 'expense')
    const totals = expenseRows.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount)
      return acc
    }, {})

    const categoriesTotals = Object.entries(totals)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)

    const avgExpense = expenseRows.length ? expenseRows.reduce((sum, item) => sum + Number(item.amount), 0) / expenseRows.length : 0
    const balance = accounts.value.reduce((sum, item) => sum + Number(item.balance), 0)

    return {
      avgExpense,
      balance,
      forecast: balance - avgExpense,
      topCategory: categoriesTotals[0]?.category || '—',
      categoriesTotals,
    }
  })

  const filterTransactions = (filters) => {
    return transactions.value.filter((item) => {
      const query = filters.query?.trim().toLowerCase()
      const minAmount = normalizeNumber(filters.minAmount)
      const maxAmount = normalizeNumber(filters.maxAmount)

      if (query && !`${item.description} ${item.account} ${item.category}`.toLowerCase().includes(query)) return false
      if (filters.category && item.category !== filters.category) return false
      if (filters.type && item.type !== filters.type) return false
      if (minAmount !== null && Number(item.amount) < minAmount) return false
      if (maxAmount !== null && Number(item.amount) > maxAmount) return false
      if (filters.dateFrom && item.date < filters.dateFrom) return false
      if (filters.dateTo && item.date > filters.dateTo) return false
      return true
    })
  }

  const addTransaction = async (payload) => {
    if (!currentUser.value) return null
    const created = await postCollection('transactions', {
      userId: currentUser.value.id,
      date: new Date().toISOString().slice(0, 10),
      account: 'Основной счёт',
      ...payload,
      amount: Number(payload.amount),
    })

    transactions.value = sortByDateDesc([created, ...transactions.value])
    return created
  }

  return {
    accounts,
    budgets,
    transactions,
    loading,
    summary,
    categories,
    report,
    loadAll,
    filterTransactions,
    addTransaction,
  }
}
