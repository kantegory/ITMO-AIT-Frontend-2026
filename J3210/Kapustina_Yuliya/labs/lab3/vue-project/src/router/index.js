import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchView.vue')
  },
  {
    path: '/fic/:id',
    name: 'Fic',
    component: () => import('@/views/FicView.vue')
  },
  {
    path: '/write',
    name: 'Write',
    component: () => import('@/views/WriteView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/write/:id',
    name: 'WriteEdit',
    component: () => import('@/views/WriteView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/:username',
    name: 'ProfileUser',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()
  
  if (to.meta.guestOnly && isAuthenticated.value) {
    return next({ name: 'Home' })
  }
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return next({ name: 'Login' })
  }
  
  next()
})

export default router