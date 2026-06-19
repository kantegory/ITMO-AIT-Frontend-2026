import instance          from '@/api/instance'
import CoursesApi        from '@/api/courses'
import AuthApi           from '@/api/auth'
import EnrollmentsApi    from '@/api/enrollments'
import { TasksApi, CompletedTasksApi, DiscussionsApi, UsersApi } from '@/api/extra'

export const coursesApi        = new CoursesApi(instance)
export const authApi           = new AuthApi(instance)
export const enrollmentsApi    = new EnrollmentsApi(instance)
export const tasksApi          = new TasksApi(instance)
export const completedTasksApi = new CompletedTasksApi(instance)
export const discussionsApi    = new DiscussionsApi(instance)
export const usersApi          = new UsersApi(instance)
