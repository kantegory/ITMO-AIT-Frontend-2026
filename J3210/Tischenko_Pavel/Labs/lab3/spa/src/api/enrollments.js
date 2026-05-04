class EnrollmentsApi {
  constructor(instance) {
    this.API = instance
  }

  listByUserId = async (userId) => {
    return this.API({
      url: '/enrollments',
      method: 'GET',
      params: { userId }
    })
  }

  getByUserAndCourse = async (userId, courseId) => {
    return this.API({
      url: '/enrollments',
      method: 'GET',
      params: { userId, courseId }
    })
  }

  create = async (payload) => {
    return this.API({
      url: '/enrollments',
      method: 'POST',
      data: payload
    })
  }

  patch = async (id, payload) => {
    return this.API({
      url: `/enrollments/${encodeURIComponent(id)}`,
      method: 'PATCH',
      data: payload
    })
  }
}

export default EnrollmentsApi
