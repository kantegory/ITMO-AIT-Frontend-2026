import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'TripPlanner | Главная' }
  },
  {
    path: '/destinations',
    name: 'destinations',
    component: () => import('@/views/DestinationsView.vue'),
    meta: { title: 'TripPlanner | Направления' }
  },
  {
    path: '/destinations/:id',
    name: 'destination-details',
    component: () => import('@/views/DestinationDetailsView.vue'),
    props: true,
    meta: { title: 'TripPlanner | Детали направления' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'TripPlanner | Вход', guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: 'TripPlanner | Регистрация', guestOnly: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'TripPlanner | Кабинет', requiresAuth: true }
  },
  {
    path: '/collaboration',
    name: 'collaboration',
    component: () => import('@/views/CollaborationView.vue'),
    meta: { title: 'TripPlanner | Совместное планирование', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'TripPlanner | Страница не найдена' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth()

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: 'dashboard' }
  }
  return true
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
})

export default router
