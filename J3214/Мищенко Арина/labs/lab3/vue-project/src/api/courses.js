class CoursesApi {
  constructor(instance) { this.API = instance }
  getAll  = ()       => this.API({ url: '/courses' })
  getById = (id)     => this.API({ url: `/courses/${id}` })
  create  = (data)   => this.API({ method: 'POST',  url: '/courses', data })
  update  = (id, d)  => this.API({ method: 'PATCH', url: `/courses/${id}`, data: d })
}
export default CoursesApi
