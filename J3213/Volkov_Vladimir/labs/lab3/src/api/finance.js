class FinanceApi {
  constructor(instance) {
    this.API = instance
  }

  async getAccounts() {
    const response = await this.API.get('/accounts')
    return response.data
  }

  async createAccount(data) {
    const response = await this.API.post('/accounts', data)
    return response.data
  }

  async patchAccount(id, data) {
    const response = await this.API.patch(`/accounts/${id}`, data)
    return response.data
  }

  async getBudgets() {
    const response = await this.API.get('/budgets')
    return response.data
  }

  async createBudget(data) {
    const response = await this.API.post('/budgets', data)
    return response.data
  }

  async getTransactions() {
    const response = await this.API.get('/transactions')
    return response.data
  }

  async createTransaction(data) {
    const response = await this.API.post('/transactions', data)
    return response.data
  }

  async deleteTransaction(id) {
    const response = await this.API.delete(`/transactions/${id}`)
    return response.data
  }

  async getRules() {
    const response = await this.API.get('/rules')
    return response.data
  }

  async createRule(data) {
    const response = await this.API.post('/rules', data)
    return response.data
  }
}

export default FinanceApi
