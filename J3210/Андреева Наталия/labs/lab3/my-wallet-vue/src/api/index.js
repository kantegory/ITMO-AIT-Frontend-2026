import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {'Content-Type': 'application/json'}
})

const currencyClient = axios.create({
    baseURL: 'https://www.cbr-xml-daily.ru'
})

export const api = {
    getUsers: () => apiClient.get('/users'),
    registerUser: (userData) => apiClient.post('/users', userData),

    getTransactions: (userId) => apiClient.get(`/transactions?userId=${userId}`),
    addTransaction: (data) => apiClient.post('/transactions', data),

    getRates: () => currencyClient.get('/daily_json.js')
}