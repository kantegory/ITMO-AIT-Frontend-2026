import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
})

instance.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('auth')
    if (stored) {
      const {token} = JSON.parse(stored)
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
  }
  return config
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth')
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)

export default instance
