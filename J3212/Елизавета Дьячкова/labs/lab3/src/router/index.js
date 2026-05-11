import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import { hasStoredSession } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: { title: 'Поиск мероприятий' },
        },
        {
          path: 'event/:id',
          name: 'event',
          component: () => import('@/views/EventDetailView.vue'),
          meta: { title: 'Мероприятие' },
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/LoginView.vue'),
          meta: { title: 'Вход', guestOnly: true },
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/RegisterView.vue'),
          meta: { title: 'Регистрация', guestOnly: true },
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
          meta: { title: 'Личный кабинет', requiresAuth: true },
        },
        {
          path: 'organizer',
          name: 'organizer',
          component: () => import('@/views/OrganizerView.vue'),
          meta: { title: 'Кабинет организатора', requiresAuth: true },
        },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = `TicketHub | ${to.meta.title}`
  }
  if (to.meta.requiresAuth && !hasStoredSession()) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  if (to.meta.guestOnly && hasStoredSession()) {
    next({ name: 'home' })
    return
  }
  next()
})

export default router
