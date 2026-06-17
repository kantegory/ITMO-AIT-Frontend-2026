import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    Accept: 'application/json'
  }
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('lab3-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
