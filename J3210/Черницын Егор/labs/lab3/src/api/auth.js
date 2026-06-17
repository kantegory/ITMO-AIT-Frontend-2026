import { api } from './http'

export async function loginUser(email, password) {
  const { data } = await api.get('/users', {
    params: {
      email,
      password,
    },
  })

  return data[0] || null
}

export async function checkEmailExists(email) {
  const { data } = await api.get('/users', {
    params: {
      email,
    },
  })

  return data.length > 0
}

export async function registerUser(user) {
  const { data } = await api.post('/users', user)
  return data
}
