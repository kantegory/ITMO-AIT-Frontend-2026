import { createRouter, createWebHistory } from 'vue-router'
import useAuthStore from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomePage.vue') },
    { path: '/event/:id', name: 'event', component: () => import('@/views/EventPage.vue') },
    { path: '/login', name: 'login', component: () => import('@/views/LoginPage.vue') },
    { path: '/profile', name: 'profile', component: () => import('@/views/ProfilePage.vue'), meta: { requiresAuth: true } },
    { path: '/teacher', name: 'teacher', component: () => import('@/views/TeacherPage.vue'), meta: { requiresAuth: true, role: 'teacher' } },
    { path: '/admin', name: 'admin', component: () => import('@/views/AdminPage.vue'), meta: { requiresAuth: true, role: 'admin' } },
  ]
})

// Защита роутов
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return { name: 'login' }
  if (to.meta.role === 'admin' && !auth.isAdmin) return { name: 'home' }
  if (to.meta.role === 'teacher' && !auth.isTeacher) return { name: 'home' }
})

export default router