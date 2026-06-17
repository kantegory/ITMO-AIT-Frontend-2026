class AuthApi {
  constructor(instance) {
    this.API = instance
  }

  login = async (payload) => {
    return this.API({
      url: '/auth/login',
      method: 'POST',
      data: payload
    })
  }

  register = async (payload) => {
    return this.API({
      url: '/auth/register',
      method: 'POST',
      data: payload
    })
  }

  me = async () => {
    return this.API({
      url: '/auth/me',
      method: 'GET'
    })
  }
}

export default AuthApi
