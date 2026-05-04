import axios from 'axios'

const API_BASE = 'http://localhost:3000'

const instance = axios.create({
  baseURL: API_BASE
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('learnify_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
export { API_BASE }
