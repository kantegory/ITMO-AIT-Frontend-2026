import { ref } from 'vue'
import api from '../api'
import { useAuthStore } from '../stores/auth'

export function useTransactions() {
  const transactions = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchTransactions() {
    const auth = useAuthStore()
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/transactions', { params: { userId: auth.userId } })
      transactions.value = data
    } catch (e) {
      error.value = 'Не удалось загрузить транзакции'
    } finally {
      loading.value = false
    }
  }

  return { transactions, loading, error, fetchTransactions }
}
