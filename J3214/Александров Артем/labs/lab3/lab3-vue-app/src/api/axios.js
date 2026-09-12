// чтобы удобно обращаться к серверу (удобный url и без дублирования заголовка)

// из папки node modules
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
})

// для подключения другим файлам
export default apiClient