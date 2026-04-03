class AuthApi {
  constructor(instance) {
    this.API = instance
  }

  register = async (userData) => {
    const users = await this.API({ url: '/users' })
    const existingUser = users.data.find(u => u.email === userData.email)
    
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует')
    }

    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      password: userData.password,
      name: userData.name || userData.email.split('@')[0]
    }

    const createdUser = await this.API({ method: 'POST', url: '/users', data: newUser })
    
    return {
      accessToken: 'token-' + Date.now(),
      user: { id: createdUser.data.id, email: createdUser.data.email, name: createdUser.data.name }
    }
  }

  login = async (credentials) => {
    const users = await this.API({ url: '/users' })
    const user = users.data.find(u => u.email === credentials.email && u.password === credentials.password)
    
    if (!user) {
      throw new Error('Неверный email или пароль')
    }

    return {
      accessToken: 'token-' + Date.now(),
      user: { id: user.id, email: user.email, name: user.name }
    }
  }
}

export default AuthApi