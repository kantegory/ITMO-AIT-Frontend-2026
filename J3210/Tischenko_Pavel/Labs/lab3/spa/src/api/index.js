import instance from './instance'
import AuthApi from './auth'
import CoursesApi from './courses'
import LessonsApi from './lessons'
import MaterialsApi from './materials'
import AssignmentsApi from './assignments'
import ThreadsApi from './threads'
import MessagesApi from './messages'
import EnrollmentsApi from './enrollments'
import CertificatesApi from './certificates'

const authApi = new AuthApi(instance)
const coursesApi = new CoursesApi(instance)
const lessonsApi = new LessonsApi(instance)
const materialsApi = new MaterialsApi(instance)
const assignmentsApi = new AssignmentsApi(instance)
const threadsApi = new ThreadsApi(instance)
const messagesApi = new MessagesApi(instance)
const enrollmentsApi = new EnrollmentsApi(instance)
const certificatesApi = new CertificatesApi(instance)

export {
  authApi,
  coursesApi,
  lessonsApi,
  materialsApi,
  assignmentsApi,
  threadsApi,
  messagesApi,
  enrollmentsApi,
  certificatesApi
}
