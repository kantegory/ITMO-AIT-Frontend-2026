import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'catalog', component: () => import('@/views/CatalogView.vue') },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue'), meta: { guestOnly: true } },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { requiresAuth: true } },
    { path: '/items/:id', name: 'details', component: () => import('@/views/DetailsView.vue') },
  ],
})

router.beforeEach((to) => {
    const { isAuth } = useAuth()
    if (to.meta.requiresAuth && !isAuth.value) {
      return { name: 'login' }
    }
    if (to.meta.guestOnly && isAuth.value) {
      return { name: 'dashboard' }
    }
})

export default router
