import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/models',
    name: 'Models',
    component: () => import('@/views/ModelsView.vue')
  },
  {
    path: '/models/:id',
    name: 'ModelDetail',
    component: () => import('@/views/ModelDetailView.vue')
  },
  {
    path: '/datasets',
    name: 'Datasets',
    component: () => import('@/views/DatasetsView.vue')
  },
  {
    path: '/spaces',
    name: 'Spaces',
    component: () => import('@/views/SpacesView.vue')
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/views/AccountView.vue'),
    meta: { requiresAuth: true }
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next({ name: 'Login' })
  } else if (to.meta.guestOnly && auth.isLoggedIn) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
