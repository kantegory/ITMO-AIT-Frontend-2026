import axios from 'axios'

export const TOKEN_KEY = 'tpulseAccessToken'
export const USER_KEY = 'tpulseCurrentUser'

export const http = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error('API недоступен. Запустите npm start в папке lab3.'))
    }
    return Promise.reject(error)
  },
)
