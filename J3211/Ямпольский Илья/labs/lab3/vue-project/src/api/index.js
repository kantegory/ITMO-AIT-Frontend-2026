import instance from './instance'

class EventsApi {
  constructor(api = instance) {
    this.api = api
  }
  getAll = async () => this.api.get('/events')
  create = async (data) => this.api.post('/events', data)
  delete = async (id) => this.api.delete(`/events/${id}`)
}

class TicketsApi {
  constructor(api = instance) {
    this.api = api
  }
  getAll = async (params) => this.api.get('/tickets', { params })
  update = async (id, data) => this.api.patch(`/tickets/${id}`, data)
}

class ReturnsApi {
  constructor(api = instance) {
    this.api = api
  }
  getAll = async (params) => this.api.get('/returns', { params })
  create = async (data) => this.api.post('/returns', data)
}

class UsersApi {
  constructor(api = instance) {
    this.api = api
  }
  login = async (data) => this.api.post('/login', data)
  register = async (data) => this.api.post('/signup', data)
}

export const eventsApi = new EventsApi()
export const ticketsApi = new TicketsApi()
export const returnsApi = new ReturnsApi()
export const usersApi = new UsersApi()
