import instance from './instance'

class AuthApi {
  async login({ email, password }) {
    const response = await instance.post('/login', { email, password })
    return response.data
  }

  async register({ name, email, password, role }) {
    const response = await instance.post('/register', { name, email, password, role })
    return response.data
  }
}

class CoursesApi {
  async getAll(page = 1, perPage = 100, filters = {}) {
    let path = `/courses?_page=${page}&_limit=${perPage}`
    if (filters.userId) path += `&userId=${filters.userId}`
    if (filters.subject) path += `&subject=${encodeURIComponent(filters.subject)}`
    if (filters.level) path += `&level=${encodeURIComponent(filters.level)}`
    if (filters.search) path += `&q=${encodeURIComponent(filters.search)}`
    const response = await instance.get(path)
    const data = response.data
    if (Array.isArray(data)) {
      return { courses: data, total: data.length }
    }
    return { courses: data.data || [], total: data.total || 0 }
  }

  async getById(id) {
    const response = await instance.get(`/courses/${id}`)
    return response.data
  }

  async create(courseData) {
    const response = await instance.post('/courses', courseData)
    return response.data
  }

  async update(id, courseData) {
    const response = await instance.put(`/courses/${id}`, courseData)
    return response.data
  }

  async delete(id) {
    const response = await instance.delete(`/courses/${id}`)
    return response.data
  }
}

class EnrollmentsApi {
  async getAll() {
    const response = await instance.get('/enrollments')
    return Array.isArray(response.data) ? response.data : (response.data.data || [])
  }

  async getByUser(userId) {
    const response = await instance.get(`/enrollments?userId=${userId}`)
    return Array.isArray(response.data) ? response.data : (response.data.data || [])
  }

  async check(userId, courseId) {
    const response = await instance.get(`/enrollments?userId=${userId}&courseId=${courseId}`)
    const list = Array.isArray(response.data) ? response.data : (response.data.data || [])
    return list.length > 0
  }

  async enroll(data) {
    const response = await instance.post('/enrollments', data)
    return response.data
  }

  async deleteByCourse(courseId) {
    const data = await this.getAll()
    const list = data.filter(e => e.courseId === courseId)
    await Promise.all(list.map(e => instance.delete(`/enrollments/${e.id}`)))
  }
}

export const authApi = new AuthApi()
export const coursesApi = new CoursesApi()
export const enrollmentsApi = new EnrollmentsApi()