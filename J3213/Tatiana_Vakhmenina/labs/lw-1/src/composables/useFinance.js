import { ref } from 'vue'
import apiClient from '../api/axios'

const transactions = ref([])
const balance = ref(0)
const loading = ref(false)
const isAuthenticated = ref(!!localStorage.getItem('token'))

export function useFinance() {

  const fetchFinancialData = async () => {
    loading.value = true
    try {
      const [tRes, pRes] = await Promise.all([
        apiClient.get('/transactions'),
        apiClient.get('/profile')
      ])
      transactions.value = tRes.data
      balance.value = pRes.data.balance
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    } finally {
      loading.value = false
    }
  }

  // POST: Настоящая авторизация со сверкой данных из базы
  const login = async (username, password) => {
    loading.value = true
    try {
      const response = await apiClient.get('/users')
      const user = response.data.find(u => u.username === username && u.password === password)
      
      if (user) {
        localStorage.setItem('token', user.token)
        isAuthenticated.value = true
        return true
      } else {
        alert('Неверный логин или пароль!')
        return false
      }
    } catch (error) {
      console.error('Ошибка при входе:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // POST: Настоящая регистрация нового пользователя в db.json
  const registerAccount = async (username, password) => {
    loading.value = true
    try {
      // Проверяем, существует ли уже пользователь с таким логином
      const response = await apiClient.get('/users')
      const userExists = response.data.some(u => u.username.toLowerCase() === username.toLowerCase())
      
      if (userExists) {
        alert('Пользователь с таким логином уже зарегистрирован!')
        return false
      }

      // Генерируем случайный токен для сессии
      const mockToken = 'token-' + Math.random().toString(36).substr(2, 9)

      const newUser = {
        username,
        password,
        token: mockToken
      }

      // Отправляем POST запрос для записи пользователя в db.json
      await apiClient.post('/users', newUser)
      alert('Регистрация успешно завершена! Теперь вы можете войти.')
      return true
    } catch (error) {
      console.error('Ошибка при регистрации:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    isAuthenticated.value = false
    transactions.value = []
    balance.value = 0
  }

  // POST: Добавление операции
  const addTransaction = async (transactionData) => {
    try {
      const response = await apiClient.post('/transactions', transactionData)
      transactions.value.push(response.data)
      const newBalance = balance.value + transactionData.amount
      await updateBalance(newBalance)
    } catch (error) {
      console.error('Ошибка при добавлении транзакции:', error)
    }
  }

  // PATCH: Частичное обновление (изменение статуса)
  const patchTransaction = async (id, updatedFields) => {
    try {
      const response = await apiClient.patch(`/transactions/${id}`, updatedFields)
      const index = transactions.value.findIndex(t => t.id === id)
      if (index !== -1) {
        transactions.value[index] = response.data
      }
    } catch (error) {
      console.error('Ошибка при обновлении транзакции:', error)
    }
  }

  // DELETE: Удаление операции
  const deleteTransaction = async (id) => {
    try {
      const transactionToDelete = transactions.value.find(t => t.id === id)
      await apiClient.delete(`/transactions/${id}`)
      
      if (transactionToDelete) {
        const newBalance = balance.value - transactionToDelete.amount
        await updateBalance(newBalance)
      }
      transactions.value = transactions.value.filter(t => t.id !== id)
    } catch (error) {
      console.error('Ошибка при удаления транзакции:', error)
    }
  }

  const updateBalance = async (newBalance) => {
    try {
      const response = await apiClient.patch('/profile', { balance: newBalance })
      balance.value = response.data.balance
    } catch (error) {
      console.error('Ошибка обновления баланса:', error)
    }
  }

  return {
    transactions,
    balance,
    loading,
    isAuthenticated,
    login,
    registerAccount,
    logout,
    fetchFinancialData,
    addTransaction,
    patchTransaction,
    deleteTransaction
  }
}