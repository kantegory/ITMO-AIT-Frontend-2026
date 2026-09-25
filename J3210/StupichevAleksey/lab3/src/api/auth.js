import instance from '@/api/instance'

class AuthApi {
  constructor(api) {
    this.API = api
  }

  login = ({email, password}) =>
    this.API.post('/login', {email, password})

  register = ({name, email, password, role}) =>
    this.API.post('/register', {
      name, email, password, role,
      enrolledCourses: [], completedCourses: [], favorites: [],
    })
}

export default new AuthApi(instance)
