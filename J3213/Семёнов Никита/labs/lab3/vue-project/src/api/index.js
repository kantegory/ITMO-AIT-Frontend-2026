import instance from './instance'

export const usersApi = {
	login(email) {
		return instance.get('/users', { params: { email } })
	},
	findByEmail(email) {
		return instance.get('/users', { params: { email } })
	},
	create(user) {
		return instance.post('/users', user)
	}
}

export const transactionsApi = {
	getByUser(userId) {
		return instance.get('/transactions', { params: { userId } })
	},
	create(transaction) {
		return instance.post('/transactions', transaction)
	}
}