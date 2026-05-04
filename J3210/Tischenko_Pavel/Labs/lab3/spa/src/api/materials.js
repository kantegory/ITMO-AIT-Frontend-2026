class MaterialsApi {
  constructor(instance) {
    this.API = instance
  }

  getByCourseId = async (courseId) => {
    return this.API({
      url: '/materials',
      method: 'GET',
      params: { courseId }
    })
  }

  create = async (payload) => {
    return this.API({
      url: '/materials',
      method: 'POST',
      data: payload
    })
  }
}

export default MaterialsApi
