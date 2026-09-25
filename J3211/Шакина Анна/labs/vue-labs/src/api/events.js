class EventsApi {
    constructor(instance) { this.API = instance }

    getAll = () => this.API({ url: '/events' })
    getById = (id) => this.API({ url: `/events/${id}` })
    create = (data) => this.API({ method: 'POST', url: '/events', data })
    update = (id, data) => this.API({ method: 'PATCH', url: `/events/${id}`, data })
    delete = (id) => this.API({ method: 'DELETE', url: `/events/${id}` })
}
export default EventsApi