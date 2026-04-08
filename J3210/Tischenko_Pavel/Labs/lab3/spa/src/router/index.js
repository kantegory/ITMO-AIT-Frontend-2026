import { createRouter, createWebHistory } from 'vue-router'
import useAuthStore from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: () => import('../views/CatalogPage.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthPage.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/course/:id',
      name: 'course',
      component: () => import('../views/CoursePage.vue')
    },
    {
      path: '/checkout/:courseId',
      name: 'checkout',
      component: () => import('../views/CheckoutPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/learn/:courseId',
      name: 'learn',
      component: () => import('../views/LearnPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/student',
      name: 'student',
      component: () => import('../views/StudentPage.vue'),
      meta: { requiresAuth: true, role: 'student' }
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: () => import('../views/TeacherPage.vue'),
      meta: { requiresAuth: true, role: 'trainer' }
    },
    {
      path: '/certificate/:id',
      name: 'certificate',
      component: () => import('../views/CertificatePage.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (!authStore.token) {
    authStore.restoreSession()
  }

  const isAuthenticated = Boolean(authStore.token)

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'auth' }
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return { name: 'catalog' }
  }

  if (to.meta.role && authStore.role !== to.meta.role) {
    return { name: authStore.role === 'trainer' ? 'teacher' : 'student' }
  }

  return true
})

export default router
