import axios from 'axios'

const apiURL = 'http://localhost:3001'

const instance = axios.create({
  baseURL: apiURL,
  headers: { 'Content-Type': 'application/json' }
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('mlpipe_token')
  if (token) config.headers['Authorization'] = 'Bearer ' + token
  return config
})

export default instance
