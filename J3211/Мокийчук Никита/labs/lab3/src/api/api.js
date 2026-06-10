import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Ошибка запроса к API'
    return Promise.reject(new Error(message))
  }
)

export const AppAPI = {
  async getCourses() {
    const { data } = await api.get('/courses')
    return data
  },

  async getPopularCourses(limit = 4) {
    const courses = await this.getCourses()
    return courses
      .filter((course) => course.isPopular === true)
      .sort((a, b) => b.students - a.students)
      .slice(0, limit)
  },

  async getCourseById(id) {
    const { data } = await api.get(`/courses/${id}`)
    return data
  },

  async getLessonsByCourse(courseId) {
    const { data } = await api.get('/lessons')
    return data
      .filter((lesson) => Number(lesson.courseId) === Number(courseId))
      .sort((a, b) => Number(a.order) - Number(b.order))
  },

  async getCommentsByCourse(courseId) {
    const { data } = await api.get('/comments')
    return data
      .filter((comment) => Number(comment.courseId) === Number(courseId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async addComment(comment) {
    const { data } = await api.post('/comments', comment)
    return data
  },

  async findUserByEmail(email) {
    const { data } = await api.get('/users')
    return (
      data.find(
        (user) =>
          String(user.email).trim().toLowerCase() ===
          String(email).trim().toLowerCase()
      ) || null
    )
  },

  async register(userData) {
    const existingUser = await this.findUserByEmail(userData.email)
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует')
    }

    const { data } = await api.post('/users', {
      ...userData,
      registeredAt: new Date().toISOString().slice(0, 10)
    })
    return data
  },

  async login(email, password) {
    const { data: users } = await api.get('/users')

    const normalizedEmail = String(email).trim().toLowerCase()
    const normalizedPassword = String(password).trim()

    const user = users.find(
      (item) =>
        String(item.email).trim().toLowerCase() === normalizedEmail &&
        String(item.password).trim() === normalizedPassword
    )

    if (!user) {
      throw new Error('Неверный email или пароль')
    }

    return user
  },

  async getEnrollmentsByUser(userId) {
    const { data } = await api.get('/enrollments')
    return data.filter((item) => String(item.userId) === String(userId))
  },

  async getEnrollment(userId, courseId) {
    const { data } = await api.get('/enrollments')
    return (
      data.find(
        (item) =>
          String(item.userId) === String(userId) &&
          Number(item.courseId) === Number(courseId)
      ) || null
    )
  },

  async enrollUser(userId, courseId) {
    const existing = await this.getEnrollment(userId, courseId)
    if (existing) return existing

    const { data } = await api.post('/enrollments', {
      userId,
      courseId,
      completedLessons: [],
      progress: 0
    })
    return data
  },

  async updateEnrollment(enrollmentId, payload) {
    const { data } = await api.patch(`/enrollments/${enrollmentId}`, payload)
    return data
  },

  async getTeacherCourses(teacherId) {
    const courses = await this.getCourses()
    return courses
      .filter((course) => String(course.teacherId) === String(teacherId))
      .sort((a, b) => String(b.id).localeCompare(String(a.id)))
  },

  async createCourse(courseData) {
    const { data } = await api.post('/courses', courseData)
    return data
  },

  async createLesson(lessonData) {
    const { data } = await api.post('/lessons', lessonData)
    return data
  },

  async updateUser(userId, payload) {
    const { data } = await api.patch(`/users/${userId}`, payload)
    return data
  }
}

export default api
