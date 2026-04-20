import axios from 'axios'

const apiURL =
  import.meta.env.PROD ? 'http://localhost:3000' : ''

const instance = axios.create({
  baseURL: apiURL,
})

export default instance
