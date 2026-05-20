import { ref } from 'vue'
import api from '../api/axios'

export function useDashboard() {
  const accounts = ref([])
  const budgets = ref([])
  const transactions = ref([])

  async function loadDashboard(userId) {
    const [accountsRes, budgetsRes, transactionsRes] = await Promise.all([
      api.get('/accounts', { params: { userId } }),
      api.get('/budgets', { params: { userId } }),
      api.get('/transactions', { params: { userId } }),
    ])

    accounts.value = accountsRes.data
    budgets.value = budgetsRes.data
    transactions.value = transactionsRes.data
  }

  return {
    accounts,
    budgets,
    transactions,
    loadDashboard,
  }
}