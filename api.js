import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

export const getCourses = async () => {
  const response = await api.get('/courses')
  return response.data
}

export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`)
  return response.data
}

export const getEnrollments = async () => {
  const response = await api.get('/enrollments')
  return response.data
}

export const addEnrollment = async (enrollment) => {
  const response = await api.post('/enrollments', enrollment)
  return response.data
}

export default api