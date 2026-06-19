class EnrollmentsApi {
  constructor(instance) { this.API = instance }
  getAll  = ()      => this.API({ url: '/enrollments' })
  create  = (data)  => this.API({ method: 'POST',  url: '/enrollments', data })
  update  = (id, d) => this.API({ method: 'PATCH', url: `/enrollments/${id}`, data: d })
}
export default EnrollmentsApi
