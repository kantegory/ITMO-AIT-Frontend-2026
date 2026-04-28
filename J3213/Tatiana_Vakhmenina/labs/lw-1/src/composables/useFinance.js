import { ref } from 'vue'
import apiClient from '../api/axios'

export function useFinance() {
  const transactions = ref([])
  const balance = ref(0)
  const loading = ref(false)

  const fetchFinancialData = async () => {
    loading.value = true
    try {
      const [tRes, pRes] = await Promise.all([
        apiClient.get('/transactions'),
        apiClient.get('/profile')
      ])
      transactions.value = tRes.data
      balance.value = pRes.data.balance
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    transactions,
    balance,
    loading,
    fetchFinancialData
  }
}