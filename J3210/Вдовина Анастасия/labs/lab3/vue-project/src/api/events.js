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

  getOne = async (id) => {
    return this.API({
      url: `/events/${id}`,
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

  updateEvent = async (id, data) => {
    return this.API({
      method: 'PATCH',
      url: `/events/${id}`,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export default EventsApi
