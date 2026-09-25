class RegistrationsApi {
    constructor(instance) { this.API = instance }

    getAll = (params) => this.API({ url: '/registrations', params })
    create = (data) => this.API({ method: 'POST', url: '/registrations', data })
    update = (id, data) => this.API({ method: 'PATCH', url: `/registrations/${id}`, data })
    delete = (id) => this.API({ method: 'DELETE', url: `/registrations/${id}` })
}
export default RegistrationsApi