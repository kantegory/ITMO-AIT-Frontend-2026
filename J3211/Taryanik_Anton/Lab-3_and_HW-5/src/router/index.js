import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:[
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/registration', name: 'registration', component: () => import('../views/RegisterView.vue') },
    { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { requiresAuth: true } },
    { path: '/search', name: 'search', component: () => import('../views/SearchView.vue'), meta: { requiresAuth: true } },
    { path: '/workers', name: 'workers', component: () => import('../views/WorkersView.vue'), meta: { requiresAuth: true } },
    { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue'), meta: { requiresAuth: true } },
    { path: '/annotation', name: 'annotation', component: () => import('../views/AnnotationView.vue'), meta: { requiresAuth: true } }
  ]
})

// Защита роутов
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuth = !!authStore.user

  if (to.meta.requiresAuth && !isAuth) {
    next({ name: 'login' })
  } else if ((to.name === 'login' || to.name === 'registration') && isAuth) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router