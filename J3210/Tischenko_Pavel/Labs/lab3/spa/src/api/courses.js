class CoursesApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({
      url: '/courses',
      method: 'GET'
    })
  }

  getOne = async (id) => {
    return this.API({
      url: `/courses/${encodeURIComponent(id)}`,
      method: 'GET'
    })
  }

  create = async (payload) => {
    return this.API({
      url: '/courses',
      method: 'POST',
      data: payload
    })
  }
}

export default CoursesApi
