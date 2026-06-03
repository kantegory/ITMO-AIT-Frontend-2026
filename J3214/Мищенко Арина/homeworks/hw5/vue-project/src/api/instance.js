import axios from 'axios'

const apiURL = 'http://localhost:3001'

const instance = axios.create({
  baseURL: apiURL
})

export default instance
