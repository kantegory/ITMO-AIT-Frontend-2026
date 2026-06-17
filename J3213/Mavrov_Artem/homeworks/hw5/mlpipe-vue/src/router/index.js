import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',          redirect: '/dashboard' },
    { path: '/login',     name: 'login',     component: () => import('@/views/LoginPage.vue') },
    { path: '/register',  name: 'register',  component: () => import('@/views/RegisterPage.vue') },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardPage.vue'),      meta: { requiresAuth: true } },
    { path: '/experiments',        name: 'experiments',  component: () => import('@/views/ExperimentsPage.vue'),     meta: { requiresAuth: true } },
    { path: '/experiments/:id',    name: 'experiment',   component: () => import('@/views/ExperimentDetailPage.vue'), meta: { requiresAuth: true } },
    { path: '/models',    name: 'models',    component: () => import('@/views/ModelsPage.vue'),          meta: { requiresAuth: true } },
    { path: '/artifacts', name: 'artifacts', component: () => import('@/views/ArtifactsPage.vue'),       meta: { requiresAuth: true } },
    { path: '/profile',   name: 'profile',   component: () => import('@/views/ProfilePage.vue'),         meta: { requiresAuth: true } },
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { path: '/login' }
  }
  if ((to.path === '/login' || to.path === '/register') && auth.isLoggedIn) {
    return { path: '/dashboard' }
  }
})

export default router
