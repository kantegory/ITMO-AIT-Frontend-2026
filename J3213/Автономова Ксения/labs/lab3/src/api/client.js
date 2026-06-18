import axios from 'axios'
const apiClient = axios.create({
  baseURL: 'http://localhost:3000'
})
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      localStorage.removeItem('userType')
    }
    return Promise.reject(error)
  }
)
export default apiClient
