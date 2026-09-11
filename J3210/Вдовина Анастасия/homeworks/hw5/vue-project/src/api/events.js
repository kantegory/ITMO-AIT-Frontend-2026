class EventsApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async (params = {}) => {
    return this.API({
      url: '/events',
      params,
    })
  }

  createEvent = async (data) => {
    return this.API({
      method: 'POST',
      url: '/events',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export default EventsApi
