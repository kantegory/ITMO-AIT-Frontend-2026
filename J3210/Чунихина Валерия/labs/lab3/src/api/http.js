import axios from 'axios'

export const huggingFaceApi = axios.create({
  baseURL: 'https://huggingface.co/api/models',
  timeout: 15000
})
