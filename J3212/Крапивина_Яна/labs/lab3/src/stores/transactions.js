import { defineStore } from 'pinia'
import { transactionsApi } from '../api'

const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [] 
  }),
  actions: {
    async loadTransactions() {
      const response = await transactionsApi.getAll()
      this.transactions = response.data
      return response
    },
    async createTransaction(data) {
      const response = await transactionsApi.createTransaction(data)
      this.transactions.push(response.data)
      return response
    }
  }
})

export default useTransactionsStore