import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

import LoginView     from '../views/LoginView.vue'
import RegisterView  from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import CoursesView   from '../views/CoursesView.vue'
import CourseView    from '../views/CourseView.vue'
import SettingsView  from '../views/SettingsView.vue'
import TeacherView   from '../views/TeacherView.vue'

const routes = [
  { path: '/login',      name: 'login',     component: LoginView,     meta: { authOnly: true } },
  { path: '/register',   name: 'register',  component: RegisterView,  meta: { authOnly: true } },
  { path: '/dashboard',  name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/courses',    name: 'courses',   component: CoursesView,   meta: { requiresAuth: true } },
  { path: '/course/:id', name: 'course',    component: CourseView,    meta: { requiresAuth: true } },
  { path: '/settings',   name: 'settings',  component: SettingsView,  meta: { requiresAuth: true } },
  { path: '/teacher',    name: 'teacher',   component: TeacherView,   meta: { requiresAuth: true } },
  { path: '/', redirect: '/dashboard' },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const { isLoggedIn, isTeacher } = useAuth()

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: 'login' }
  }

  if (to.meta.authOnly && isLoggedIn.value) {
    return { name: isTeacher.value ? 'teacher' : 'dashboard' }
  }
})

export default router
