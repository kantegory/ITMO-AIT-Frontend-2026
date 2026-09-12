class DatapointsApi {
  constructor(instance) {
    this.API = instance
  }

  getByOrder = async (orderId) => {
    return this.API({
      url: '/444/datapoints',
      params: { orderId },
    })
  }
}

export default DatapointsApi
