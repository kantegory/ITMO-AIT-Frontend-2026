class TransactionsApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({
      url: '/transactions'
    })
  }

  createTransaction = async (data) => {
    return this.API({
      method: 'POST',
      url: '/transactions',
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

export default TransactionsApi