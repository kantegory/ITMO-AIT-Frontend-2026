import { createRouter, createWebHistory } from 'vue-router'
import useAuthStore from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue'),
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('@/views/EventsPage.vue'),
    },
    {
      path: '/events/:id',
      name: 'event',
      component: () => import('@/views/EventPage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterPage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfilePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/organizer',
      name: 'organizer',
      component: () => import('@/views/OrganizerPage.vue'),
      meta: { requiresAuth: true, requiresOrganizer: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login' }
  if (to.meta.requiresOrganizer && !auth.isOrganizer) return { name: 'profile' }
  if (to.meta.guestOnly && auth.isAuthenticated) return { name: 'profile' }

  return true
})

export default router
