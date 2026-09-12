class OrdersApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({
      url: '/444/orders',
    })
  }

  getById = async (id) => {
    return this.API({
      url: `/444/orders/${id}`,
    })
  }
}

export default OrdersApi
