import instance from '@/api/instance'
import AuthApi from '@/api/auth'
import UsersApi from '@/api/users'
import CoursesApi from '@/api/courses'

const authApi = new AuthApi(instance)
const usersApi = new UsersApi(instance)
const coursesApi = new CoursesApi(instance)

export {
    authApi,
    usersApi,
    coursesApi,
}
