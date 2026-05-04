class ThreadsApi {
  constructor(instance) {
    this.API = instance
  }

  getByCourseId = async (courseId) => {
    return this.API({
      url: '/threads',
      method: 'GET',
      params: { courseId }
    })
  }
}

export default ThreadsApi
