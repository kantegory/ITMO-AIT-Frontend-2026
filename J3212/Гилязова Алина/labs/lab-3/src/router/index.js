import { createRouter, createWebHistory } from 'vue-router'
import useAuthStore from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',

      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/event/:id',
      name: 'event',

      props: true,
      component: () => import('@/views/EventView.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: { redirectIfAuthenticated: true },
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      meta: { redirectIfAuthenticated: true },
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      meta: { requiresAuth: true },
      component: () => import('@/views/ProfileView.vue')
    },

    { path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.meta.redirectIfAuthenticated && auth.isAuthenticated) {
    return { name: 'profile' }
  }
  return true
})

export default router
