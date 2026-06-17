import axios from 'axios'

const apiURL = 'http://localhost:3000'
const instance = axios.create({ baseURL: apiURL })

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
