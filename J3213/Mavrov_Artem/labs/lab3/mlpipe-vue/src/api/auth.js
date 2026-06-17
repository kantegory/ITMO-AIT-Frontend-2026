class AuthApi {
  constructor(instance) {
    this.API = instance
  }

  login = async (email, password) => {
    return this.API({ method: 'POST', url: '/auth/login', data: { email, password } })
  }

  register = async (name, email, password, role) => {
    return this.API({ method: 'POST', url: '/auth/register', data: { name, email, password, role } })
  }

  logout = async () => {
    return this.API({ method: 'POST', url: '/auth/logout' })
  }

  me = async () => {
    return this.API({ url: '/auth/me' })
  }
}

export default AuthApi
