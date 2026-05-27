import axios from 'axios'
import { ref } from 'vue'
import { useSession } from './useSession'

const API_BASE_URLS = ['http://localhost:3000', 'http://127.0.0.1:3000']
const resolvedBaseUrl = ref(API_BASE_URLS[0])

const clients = API_BASE_URLS.map((baseURL) => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  client.interceptors.request.use((config) => {
    const { state } = useSession()
    if (state.token) {
      config.headers.Authorization = `Bearer ${state.token}`
    }

    return config
  })

  return client
})

function normalizeAxiosError(error) {
  const response = error.response
  const message = response?.data?.message || `Ошибка запроса: ${response?.status || 500}`
  const appError = new Error(message)
  appError.status = response?.status
  appError.payload = response?.data
  return appError
}

async function request(config) {
  let lastNetworkError = null

  for (let index = 0; index < clients.length; index += 1) {
    const client = clients[index]

    try {
      const response = await client.request(config)
      resolvedBaseUrl.value = API_BASE_URLS[index]
      return response.data
    } catch (error) {
      if (error.response) {
        throw normalizeAxiosError(error)
      }

      lastNetworkError = error
    }
  }

  const networkError = new Error(
    'Не удалось подключиться к API (http://localhost:3000 или http://127.0.0.1:3000). Запустите mock API: npm install && npm run mock-api'
  )
  networkError.isNetworkError = true
  networkError.cause = lastNetworkError
  throw networkError
}

export function useApi() {
  return {
    resolvedBaseUrl,
    request,
    get: (url, config = {}) => request({ method: 'get', url, ...config }),
    post: (url, data = {}, config = {}) => request({ method: 'post', url, data, ...config })
  }
}
