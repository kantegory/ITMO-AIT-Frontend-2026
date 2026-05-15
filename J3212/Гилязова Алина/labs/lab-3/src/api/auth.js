class AuthApi {
  constructor(instance) {
    this.API = instance
  }

  register = async (data) => {
    return this.API({
      method: 'POST',
      url: '/register',
      data,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  login = async (data) => {
    return this.API({
      method: 'POST',
      url: '/login',
      data,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export default AuthApi
