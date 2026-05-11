class AuthApi {
  constructor(instance) {
    this.API = instance
  }

  getUsers = async () => {
    return this.API({
      url: '/users',
      method: 'GET',
    })
  }

  findByEmail = async (email) => {
    const response = await this.API({
      url: '/users',
      method: 'GET',
      params: {
        email,
      },
    })

    const user = Array.isArray(response.data) ? response.data[0] : null

    return {
      data: user || null,
    }
  }

  login = async (email, password) => {
    const response = await this.API({
      url: '/users',
      method: 'GET',
      params: {
        email,
        password,
      },
    })

    const user = Array.isArray(response.data) ? response.data[0] : null

    return {
      data: user || null,
    }
  }

  register = async (data) => {
    return this.API({
      url: '/users',
      method: 'POST',
      data,
    })
  }
}

export default AuthApi