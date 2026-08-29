import { ref, computed } from 'vue'
import apiClient from '@/api/axios'

const transactions = ref([])
const isLoading = ref(false)
const error = ref(null)

export function useTransactions() {
  const fetchTransactions = async (userId) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/transactions')
      const allTx = Array.isArray(response.data) ? response.data : []
      
      // если передан userId — фильтруем транзакции только для этого пользователя
      if (userId) {
        transactions.value = allTx.filter(t => String(t.userId) === String(userId))
      } else {
        transactions.value = allTx
      }
    } catch (err) {
      error.value = 'Ошибка при загрузке транзакций'
    } finally {
      isLoading.value = false
    }
  }

  const addTransaction = async (txData) => {
    try {
      const response = await apiClient.post('/transactions', txData)
      transactions.value.unshift(response.data)
      return response.data
    } catch (err) {
      throw new Error('Не удалось сохранить операцию')
    }
  }

  const removeTransaction = async (id) => {
    try {
      await apiClient.delete(`/transactions/${id}`)
      transactions.value = transactions.value.filter(t => t.id !== id)
    } catch (err) {
      throw new Error('Ошибка при удалении операции')
    }
  }

  const totalExpenses = computed(() => {
    return transactions.value
      .filter(tx => tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
  })

  const totalIncome = computed(() => {
    return transactions.value
      .filter(tx => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0)
  })

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    addTransaction,
    removeTransaction,
    totalExpenses,
    totalIncome
  }
}