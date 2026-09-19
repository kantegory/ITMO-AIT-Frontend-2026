import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

export function useApi() {
  async function get(path, params) {
    try {
      const response = await api.get(path, { params })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async function post(path, data) {
    try {
      const response = await api.post(path, data)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async function patch(path, data) {
    try {
      const response = await api.patch(path, data)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  function getErrorMessage(error) {
    if (error.code === 'ERR_NETWORK') {
      return 'Не удалось подключиться к API. Убедитесь, что json-server запущен на http://localhost:3000.'
    }
    return error.response
      ? `Ошибка API: ${error.response.status} ${error.response.statusText}`
      : error.message || 'Не удалось получить данные от API.'
  }

  return { get, post, patch }
}
