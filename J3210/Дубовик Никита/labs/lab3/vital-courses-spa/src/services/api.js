import axios from 'axios'

export const API_BASE = 'http://localhost:3000'

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

function extractTotalCount(response) {
  return parseInt(response.headers['x-total-count'], 10) || 0
}

export async function register(userData) {
  const { data } = await apiClient.post('/signup', userData)
  const { accessToken, user } = data
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('user', JSON.stringify(user))
  return { accessToken, user }
}

export async function login(email, password) {
  const { data } = await apiClient.post('/login', { email, password })
  const { accessToken, user } = data
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('user', JSON.stringify(user))
  return { accessToken, user }
}

export function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
  window.location.href = '/'
}

export async function getCourses(params = {}) {
  const response = await apiClient.get('/courses', {
    params: {
      _expand: 'instructor',
      ...params
    }
  })
  return {
    courses: response.data,
    total: extractTotalCount(response)
  }
}

export async function getCourseById(id) {
  const { data } = await apiClient.get(`/courses/${id}`, {
    params: { _expand: 'instructor' }
  })
  return data
}

export async function getPopularCourses(limit = 3) {
  const { data } = await apiClient.get('/courses', {
    params: {
      _sort: 'studentsCount',
      _order: 'desc',
      _limit: limit,
      _expand: 'instructor'
    }
  })
  return data
}

export async function getMaterials(courseId) {
  const { data } = await apiClient.get('/materials', { params: { courseId } })
  return data
}

export async function getAssignments(courseId) {
  const { data } = await apiClient.get('/assignments', { params: { courseId } })
  return data
}

export async function getDiscussions(courseId) {
  const { data } = await apiClient.get('/discussions', {
    params: { courseId, _expand: 'user' }
  })
  return data
}

export async function getUserByEmail(email) {
  const { data } = await apiClient.get('/users', { params: { email } })
  return data[0] || null
}

export async function getInstructorByUserId(userId) {
  const { data } = await apiClient.get('/instructors', { params: { userId } })
  return data[0] || null
}

export async function getUserCourses(userId) {
  const { data } = await apiClient.get('/user_courses', { params: { userId } })
  return data
}

export async function getCertificates(userId) {
  const { data } = await apiClient.get('/certificates', { params: { userId } })
  return data
}

export async function getCoursesByInstructor(instructorId) {
  const { data } = await apiClient.get('/courses', { params: { instructorId } })
  return data
}

export async function getUserCoursesByCourseIds(courseIds) {
  if (!courseIds.length) return []
  const params = new URLSearchParams()
  courseIds.forEach(id => params.append('courseId', id))
  const { data } = await apiClient.get('/user_courses', { params })
  return data
}

export async function getMaterialsByCourseIds(courseIds) {
  if (!courseIds.length) return []
  const params = new URLSearchParams()
  courseIds.forEach(id => params.append('courseId', id))
  const { data } = await apiClient.get('/materials', { params })
  return data
}

export async function getReviewsByCourseIds(courseIds) {
  if (!courseIds.length) return []
  const params = new URLSearchParams()
  courseIds.forEach(id => params.append('courseId', id))
  const { data } = await apiClient.get('/reviews', { params })
  return data
}
