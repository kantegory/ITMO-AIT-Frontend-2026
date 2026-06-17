import axios from 'axios'

const apiURL = 'http://localhost:3000'

const instance = axios.create({ baseURL: apiURL })

instance.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('auth')
    if (raw) {
      const token = JSON.parse(raw)?.accessToken
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
  } catch (error) {
    console.warn('Не удалось прочитать токен авторизации:', error)
  }
  return config
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error?.response?.data
    const message =
      (typeof data === 'string' && data) ||
      data?.message ||
      data?.error ||
      error.message ||
      'Ошибка запроса'
    return Promise.reject(new Error(message))
  }
)

export default instance
