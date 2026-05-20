import { computed, ref } from 'vue'
import api from '../api/axios'

export function useTransactions() {
  const transactions = ref([])
  const search = ref('')
  const category = ref('')

  async function loadTransactions(userId) {
    const response = await api.get('/transactions', { params: { userId } })
    transactions.value = response.data
  }

  const filteredTransactions = computed(() => {
    return transactions.value.filter((item) => {
      const matchesSearch =
        item.description.toLowerCase().includes(search.value.toLowerCase()) ||
        item.category.toLowerCase().includes(search.value.toLowerCase())

      const matchesCategory = category.value ? item.category === category.value : true

      return matchesSearch && matchesCategory
    })
  })

  const incomeSum = computed(() =>
    filteredTransactions.value
      .filter((item) => item.type === 'Доход')
      .reduce((sum, item) => sum + item.amount, 0)
  )

  const expenseSum = computed(() =>
    filteredTransactions.value
      .filter((item) => item.type === 'Расход')
      .reduce((sum, item) => sum + item.amount, 0)
  )

  return {
    transactions,
    search,
    category,
    filteredTransactions,
    incomeSum,
    expenseSum,
    loadTransactions,
  }
}