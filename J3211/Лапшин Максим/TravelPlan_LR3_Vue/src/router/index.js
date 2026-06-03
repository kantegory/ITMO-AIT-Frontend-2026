import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Поиск туров' },
    },
    {
      path: '/tours/:id',
      name: 'tour',
      component: () => import('@/views/TourDetailsView.vue'),
      meta: { title: 'Описание тура' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { title: 'Личный кабинет', requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: 'Вход' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { title: 'Регистрация' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Страница не найдена' },
    },
  ],
})

router.beforeEach((to) => {
  document.title = `${to.meta.title ?? 'TravelPlan'} — TravelPlan`
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (['login', 'register'].includes(to.name) && isAuthenticated()) {
    return { name: 'dashboard' }
  }
  return true
})

export default router
