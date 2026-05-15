class TicketsApi {
  constructor(instance) {
    this.API = instance
  }

  getByUser = async (userId) => {
    return this.API({
      url: '/tickets',
      params: { userId, _sort: 'id', _order: 'desc' }
    })
  }

  create = async (data) => {
    return this.API({
      method: 'POST',
      url: '/tickets',
      data,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  refund = async (id) => {
    return this.API({
      method: 'PATCH',
      url: `/tickets/${encodeURIComponent(id)}`,
      data: { refunded: true },
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export default TicketsApi
