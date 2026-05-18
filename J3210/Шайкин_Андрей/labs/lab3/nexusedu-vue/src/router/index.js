import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: () => import('../views/CatalogView.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/course/:id',
      name: 'course',
      component: () => import('../views/CourseView.vue')
    }
  ]
})

router.beforeEach((to, from) => {
  const isAuthenticated = !!localStorage.getItem('accessToken')
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'auth' }
  }
  if (to.name === 'auth' && isAuthenticated) {
    return { name: 'profile' }
  }
})

export default router