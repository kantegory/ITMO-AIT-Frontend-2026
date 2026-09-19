import api from './axios'

export async function loginRequest(email, password) {
  const response = await api.get('/users', {
    params: { email, password }
  })

  const users = response.data

  if (!users.length) {
    throw new Error('Неверный email или пароль')
  }

  return users[0]
}

export async function registerRequest(userData) {
  const checkResponse = await api.get('/users', {
    params: { email: userData.email }
  })

  const existingUsers = checkResponse.data

  if (existingUsers.length > 0) {
    throw new Error('Пользователь с таким email уже существует')
  }

  const response = await api.post('/users', userData)
  return response.data
}