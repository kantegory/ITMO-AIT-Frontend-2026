class EventsApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({
      url: '/events',
      params: { _sort: 'id', _order: 'asc' }
    })
  }

  getById = async (id) => {
    return this.API({ url: `/events/${encodeURIComponent(id)}` })
  }

  getByOrganizer = async (userId) => {
    return this.API({
      url: '/events',
      params: { userId, _sort: 'id', _order: 'desc' }
    })
  }

  create = async (data) => {
    return this.API({
      method: 'POST',
      url: '/660/events',
      data,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  update = async (id, data) => {
    return this.API({
      method: 'PATCH',
      url: `/660/events/${encodeURIComponent(id)}`,
      data,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  remove = async (id) => {
    return this.API({
      method: 'DELETE',
      url: `/660/events/${encodeURIComponent(id)}`
    })
  }
}

export default EventsApi
