class UsersApi {
    constructor(instance) { this.API = instance }

    getAll = () => this.API({ url: '/users' })
    getById = (id) => this.API({ url: `/users/${id}` })
    login = (data) => this.API({ method: 'POST', url: '/login', data })
    register = (data) => this.API({ method: 'POST', url: '/register', data })
    create = (data) => this.API({ method: 'POST', url: '/users', data })
    update = (id, data) => this.API({ method: 'PATCH', url: `/users/${id}`, data })
    delete = (id) => this.API({ method: 'DELETE', url: `/users/${id}` })
}
export default UsersApi