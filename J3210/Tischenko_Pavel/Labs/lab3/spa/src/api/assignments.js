class AssignmentsApi {
  constructor(instance) {
    this.API = instance
  }

  getByCourseId = async (courseId) => {
    return this.API({
      url: '/assignments',
      method: 'GET',
      params: { courseId }
    })
  }

  create = async (payload) => {
    return this.API({
      url: '/assignments',
      method: 'POST',
      data: payload
    })
  }
}

export default AssignmentsApi
