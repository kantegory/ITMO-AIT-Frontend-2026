import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const cbrApi = axios.create({
  baseURL: 'https://www.cbr-xml-daily.ru',
})
