import axios from 'axios'

const http = axios.create({ baseURL: 'http://localhost:3000' })

export function useApi() {
  async function get(path, params = {}) {
    const { data } = await http.get(path, { params })
    return data
  }

  async function post(path, body) {
    const { data } = await http.post(path, body)
    return data
  }

  async function patch(path, body) {
    const { data } = await http.patch(path, body)
    return data
  }

  async function del(path) {
    await http.delete(path)
  }

  return { get, post, patch, del }
}
