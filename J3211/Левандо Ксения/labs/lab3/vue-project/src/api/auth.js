import api from './instance'

class AuthApi {
  constructor(instance) {
    this.API = instance
  }

  // регистрация
  register = async ({ email, password, name }) => {
    const users = await this.API.get('/users')
    const existingUser = users.data.find(u => u.email === email)
    
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name: name || email.split('@')[0]
    }

    const createdUser = await this.API.post('/users', newUser)
    
    return {
      accessToken: 'token-' + Date.now(),
      user: { id: createdUser.data.id, email: createdUser.data.email, name: createdUser.data.name }
    }
  }

  login = async ({ email, password }) => {
    const users = await this.API.get('/users')
    const user = users.data.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Incorrect email or password')
    }

    return {
      accessToken: 'token-' + Date.now(),
      user: { id: user.id, email: user.email, name: user.name }
    }
  }
  // --- Организатор ---
  registerOrganizer = async ({ email, password, name }) => {
    const orgs = await this.API.get('/organizers')
    if (orgs.data.find(o => o.email === email)) {
      throw new Error('Organizer with this email already exists')
    }
    const newOrg = { id: Date.now().toString(), email, password, name }
    const created = await this.API.post('/organizers', newOrg)
    return { accessToken: 'token-' + Date.now(), organizer: created.data }
  }

  loginOrganizer = async ({ email, password }) => {
    const orgs = await this.API.get('/organizers')
    const org = orgs.data.find(o => o.email === email && o.password === password)
    if (!org) throw new Error('Incorrect email or password')
    return { accessToken: 'token-' + Date.now(), organizer: org }
  }

  logout = () => {
    localStorage.removeItem('auth')
    localStorage.removeItem('user')
    localStorage.removeItem('organizerAuth')
    localStorage.removeItem('organizer')
  }
}

export default new AuthApi(api)