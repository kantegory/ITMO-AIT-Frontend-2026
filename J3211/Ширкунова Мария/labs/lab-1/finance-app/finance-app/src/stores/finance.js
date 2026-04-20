import { defineStore } from 'pinia'
import { financeApi } from '@/api'

const useFinanceStore = defineStore('finance', {
  state: () => ({
    transactions: [],
    user: { id: 1 }
  }),
  actions: {
    async loadTransactions() {
      const response = await financeApi.getTransactions(this.user.id)
      this.transactions = response.data
      return response
    },
    async addTransaction(data) {
      data.userId = this.user.id
      data.date = new Date().toLocaleDateString('ru-RU')
      const response = await financeApi.createTransaction(data)
      this.transactions.push(response.data)
      return response
    }
  }
})

export default useFinanceStore
