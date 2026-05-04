class LessonsApi {
  constructor(instance) {
    this.API = instance
  }

  getByCourseId = async (courseId) => {
    return this.API({
      url: '/lessons',
      method: 'GET',
      params: {
        courseId
      }
    })
  }

  create = async (payload) => {
    return this.API({
      url: '/lessons',
      method: 'POST',
      data: payload
    })
  }
}

export default LessonsApi
