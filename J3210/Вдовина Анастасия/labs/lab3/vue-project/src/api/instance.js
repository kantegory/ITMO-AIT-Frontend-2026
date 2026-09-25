import axios from 'axios'

const apiURL = 'http://localhost:3000'

const instance = axios.create({
  baseURL: apiURL,
})

instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

// токен живёт час: когда сервер отвечает 401, чистим сессию и уводим на вход
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error.response && error.response.status === 401
    const isLoginPage = window.location.pathname === '/login'

    if (isUnauthorized && !isLoginPage) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('user')

      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default instance
