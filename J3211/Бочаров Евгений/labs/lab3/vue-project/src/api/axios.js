import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    res => res.data,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('authToken')
            localStorage.removeItem('currentUser')
            window.dispatchEvent(new CustomEvent('auth:logout'))
        }
        return Promise.reject(err)
    }
)

export default api