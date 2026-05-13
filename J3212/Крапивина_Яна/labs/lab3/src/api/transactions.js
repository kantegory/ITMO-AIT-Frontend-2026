class TransactionsApi {
  constructor(request) {
    this.request = request;
  }

  getAll = async () => {
    return this.request('/transactions');
  }

  createTransaction = async (data) => {
    return this.request('/transactions', {
      method: 'POST',
      data: data
    });
  }
}

export default TransactionsApi;