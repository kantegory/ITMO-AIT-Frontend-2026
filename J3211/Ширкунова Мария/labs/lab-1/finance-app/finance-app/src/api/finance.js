class FinanceApi {
  constructor(instance) {
    this.API = instance
  }

  getTransactions = async (userId) => {
    return this.API({ url: `/600/transactions?userId=${userId}` })
  }

  createTransaction = async (data) => {
    return this.API({
      method: 'POST',
      url: '/600/transactions',
      data,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
export default FinanceApi
