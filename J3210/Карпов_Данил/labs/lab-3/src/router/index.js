import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue') },
    { path: '/courses', name: 'courses', component: () => import('@/views/SearchView.vue') },
    { path: '/courses/:id', name: 'course', component: () => import('@/views/CourseView.vue') },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: () => import('@/views/TeacherView.vue'),
      meta: { requiresAuth: true, requiresTeacher: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return { name: 'login' }
  if (to.meta.requiresTeacher && auth.user?.role !== 'teacher') return { name: 'home' }
  if ((to.name === 'login' || to.name === 'register') && auth.isLoggedIn) return { name: 'home' }
})

export default router
