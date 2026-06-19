class AuthApi {
  constructor(instance) { this.API = instance }
  // Ищем по email
  findByEmail = (email) => this.API({ url: `/users?email=${email}` })
  register    = (data)  => this.API({ method: 'POST',  url: '/users', data })
  update      = (id, d) => this.API({ method: 'PATCH', url: `/users/${id}`, data: d })
}
export default AuthApi
