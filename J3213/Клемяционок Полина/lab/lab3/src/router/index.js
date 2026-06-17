import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import LecturesView from '../views/LecturesView.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import InstructorDashboard from '../views/InstructorDashboard.vue'
import InstructorInfo from '../views/InstructorInfo.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/lectures', name: 'Lectures', component: LecturesView },
  { path: '/instructor', name: 'InstructorInfo', component: InstructorInfo },
  { path: '/student', name: 'Student', component: StudentDashboard, meta: { auth: true, role: 'student' } },
  { path: '/instructor/dashboard', name: 'Instructor', component: InstructorDashboard, meta: { auth: true, role: 'instructor' } }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('currentUser'))
  if (to.meta.auth && !user) return next('/login')
  if (to.meta.auth && user.role !== to.meta.role) return next('/')
  if ((to.path === '/login' || to.path === '/register') && user) {
    return next(user.role === 'student' ? '/student' : '/instructor/dashboard')
  }
  next()
})

export default router