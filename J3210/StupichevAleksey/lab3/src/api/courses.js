import instance from '@/api/instance'

class CoursesApi {
  constructor(api) {
    this.API = api
  }

  getAll = (params = {}) => this.API.get('/courses', {params})
  getById = (id) => this.API.get(`/courses/${id}`)
  create = (data) => this.API.post('/courses', data)
  update = (id, data) => this.API.patch(`/courses/${id}`, data)
  remove = (id) => this.API.delete(`/courses/${id}`)
}

export default new CoursesApi(instance)
