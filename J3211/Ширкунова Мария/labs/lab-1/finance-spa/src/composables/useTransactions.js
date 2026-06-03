import { ref, computed } from 'vue'
import { useApi } from './useApi'
import { useAuth } from './useAuth'

export function useTransactions() {
  const { request, loading, error } = useApi()
  const { user } = useAuth()

  const transactions = ref([])
  const filters = ref({ search: '', category: 'all', account: 'all' })

  const loadTransactions = async () => {
    const userId = user.value?.id
    if (!userId) return
    transactions.value = await request('get', `/600/transactions?userId=${userId}`)
  }

  const addTransaction = async (payload) => {
    const data = {
      ...payload,
      userId: user.value.id,
      amount: parseFloat(payload.amount),
      date: new Date().toLocaleDateString('ru-RU')
    }
    await request('post', '/600/transactions', data)
    await loadTransactions()
  }

  const filteredTransactions = computed(() => {
    return transactions.value.filter((t) => {
      const txt = filters.value.search.toLowerCase()
      const okText = t.description.toLowerCase().includes(txt)
      const okCat = filters.value.category === 'all' || filters.value.category === t.category
      const okAcc = filters.value.account === 'all' || t.accountName.includes(filters.value.account)
      return okText && okCat && okAcc
    })
  })

  const accounts = computed(() => {
    const base = [
      { name: 'Зарплатная карта', type: 'primary', balance: 0 },
      { name: 'Наличные',         type: 'success', balance: 0 },
      { name: 'Кредитная карта',  type: 'credit',  balance: 0 }
    ]
    transactions.value.forEach((t) => {
      const acc = base.find((a) => a.name === t.accountName)
      if (!acc) return
      const sum = parseFloat(t.amount)
      acc.balance += t.transType === 'expense' ? -sum : sum
    })
    return base
  })

  return {
    transactions, filteredTransactions, accounts,
    filters, loading, error,
    loadTransactions, addTransaction
  }
}
