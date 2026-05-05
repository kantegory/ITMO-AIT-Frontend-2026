const URL = 'http://localhost:3000';

window.API = {
    async login(email) {
        const res = await fetch(`${URL}/users?email=${email}`);
        const users = await res.json();
        return users[0];
    },

    async register(data) {
        const res = await fetch(`${URL}/users`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        return await res.json();
    },

    async getAccounts(userId) {
        const res = await fetch(`${URL}/accounts?userId=${userId}`);
        return await res.json();
    },

    async getTransactions(userId) {
        const res = await fetch(`${URL}/transactions?userId=${userId}`);
        return await res.json();
    },

    async getCategories() {
        const res = await fetch(`${URL}/categories`);
        return await res.json();
    },

    async getRules(userId) {
        const res = await fetch(`${URL}/rules?userId=${userId}`);
        return await res.json();
    },

    async getExchangeRates() {
        const res = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        const data = await res.json();
        return data['Valute'];
    },

    async createAccount(data) {
        const res = await fetch(`${URL}/accounts`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        return await res.json();
    },

    async createTransaction(data) {
        const res = await fetch(`${URL}/transactions`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        return await res.json();
    },

    async updateAccount(id, data) {
        const res = await fetch(`${URL}/accounts/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        return await res.json();
    },

    async createCategory(data) {
        const res = await fetch(`${URL}/categories`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        return await res.json();
    },

    async createRule(data) {
        const res = await fetch(`${URL}/rules`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        return await res.json();
    },

    async deleteCategory(id) {
        await fetch(`${URL}/categories/${id}`, {method: 'DELETE'});
    },

    async deleteRule(id) {
        await fetch(`${URL}/rules/${id}`, {method: 'DELETE'});
    }
};