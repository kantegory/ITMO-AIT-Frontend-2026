import { createRouter, createWebHistory } from 'vue-router'
import pinia        from '@/stores'
import useAuthStore from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',            name: 'home',      component: () => import('../views/HomePage.vue') },
    { path: '/login',       name: 'login',     component: () => import('../views/LoginPage.vue') },
    { path: '/register',    name: 'register',  component: () => import('../views/RegisterPage.vue') },
    { path: '/courses',     name: 'courses',   component: () => import('../views/CoursesPage.vue') },
    { path: '/courses/:id', name: 'course',    component: () => import('../views/CoursePage.vue') },
    {
      path: '/dashboard', name: 'dashboard',
      component: () => import('../views/DashboardPage.vue'),
      meta: { requiresAuth: true, role: 'student' }
    },
    {
      path: '/teacher', name: 'teacher',
      component: () => import('../views/TeacherPage.vue'),
      meta: { requiresAuth: true, role: 'teacher' }
    }
  ]
})

// Навигационный guard - аналог проверки sessionStorage в начале каждого HTML-файла
router.beforeEach((to) => {
  const auth = useAuthStore(pinia)
  if (to.meta.requiresAuth && !auth.isLoggedIn) return { name: 'login' }
  if (to.meta.role === 'student' && auth.isTeacher)  return { name: 'teacher' }
  if (to.meta.role === 'teacher' && !auth.isTeacher && auth.isLoggedIn) return { name: 'dashboard' }
})

export default router
