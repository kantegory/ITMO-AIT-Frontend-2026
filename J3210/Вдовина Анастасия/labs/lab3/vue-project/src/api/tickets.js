class TicketsApi {
  constructor(instance) {
    this.API = instance
  }

  getByUser = async (userId) => {
    return this.API({
      url: '/tickets',
      params: { userId },
    })
  }

  getAll = async () => {
    return this.API({
      url: '/tickets',
    })
  }

  createTicket = async (data) => {
    return this.API({
      method: 'POST',
      url: '/tickets',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  updateStatus = async (id, status) => {
    return this.API({
      method: 'PATCH',
      url: `/tickets/${id}`,
      data: { status },
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  getRefunds = async (userId) => {
    return this.API({
      url: '/refunds',
      params: { userId },
    })
  }

  getAllRefunds = async () => {
    return this.API({
      url: '/refunds',
    })
  }

  createRefund = async (data) => {
    return this.API({
      method: 'POST',
      url: '/refunds',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export default TicketsApi
