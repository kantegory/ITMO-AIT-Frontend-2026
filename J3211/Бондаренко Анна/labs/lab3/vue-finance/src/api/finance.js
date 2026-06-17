import axios from 'axios'

class FinanceApi {
    constructor(instance) {
        this.API = instance
    }

    login = async (email) => {
        const response = await this.API.get(`/users?email=${email}`)
        return response.data[0]
    }

    register = async (data) => {
        const response = await this.API.post(`/users`, data)
        return response.data
    }

    getAccounts = async (userId) => {
        const response = await this.API.get(`/accounts?userId=${userId}`)
        return response.data
    }

    getTransactions = async (userId) => {
        const response = await this.API.get(`/transactions?userId=${userId}`)
        return response.data
    }

    getCategories = async () => {
        const response = await this.API.get(`/categories`)
        return response.data
    }

    getRules = async (userId) => {
        const response = await this.API.get(`/rules?userId=${userId}`)
        return response.data
    }

    createAccount = async (data) => {
        const response = await this.API.post(`/accounts`, data)
        return response.data
    }

    updateAccount = async (id, data) => {
        const response = await this.API.patch(`/accounts/${id}`, data)
        return response.data
    }

    createTransaction = async (data) => {
        const response = await this.API.post(`/transactions`, data)
        return response.data
    }

    createCategory = async (data) => {
        const response = await this.API.post(`/categories`, data)
        return response.data
    }

    createRule = async (data) => {
        const response = await this.API.post(`/rules`, data)
        return response.data
    }

    deleteCategory = async (id) => {
        await this.API.delete(`/categories/${id}`)
    }

    deleteRule = async (id) => {
        await this.API.delete(`/rules/${id}`)
    }

    getExchangeRates = async () => {
        const response = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js')
        return response.data.Valute
    }
}

export default FinanceApi