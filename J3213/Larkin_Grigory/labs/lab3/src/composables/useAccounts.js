import { ref } from 'vue'
import api from '../api'
import { useAuthStore } from '../stores/auth'

export function useAccounts() {
  const accounts = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchAccounts() {
    const auth = useAuthStore()
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/accounts', { params: { userId: auth.userId } })
      accounts.value = data
    } catch (e) {
      error.value = 'Не удалось загрузить счета'
    } finally {
      loading.value = false
    }
  }

  async function addAccount(name, mask, balance) {
    const auth = useAuthStore()
    const { data } = await api.post('/accounts', {
      userId: parseInt(auth.userId),
      name,
      mask,
      balance: parseInt(balance) || 0
    })
    accounts.value.push(data)
  }

  return { accounts, loading, error, fetchAccounts, addAccount }
}
