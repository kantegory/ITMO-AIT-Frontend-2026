import { createRouter, createWebHistory } from 'vue-router'
import { getStoredUser } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { guestOnly: true, title: 'Project Manager' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true, title: 'Вход' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guestOnly: true, title: 'Регистрация' },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/ProjectsView.vue'),
      meta: { requiresAuth: true, title: 'Мои проекты' },
    },
    {
      path: '/projects/:id',
      name: 'project',
      component: () => import('@/views/ProjectDetailsView.vue'),
      meta: { requiresAuth: true, title: 'Проект' },
      props: true,
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
  const user = getStoredUser()

  if (to.meta.requiresAuth && !user) return { name: 'login' }
  if (to.meta.guestOnly && user) return { name: 'projects' }

  document.title = `${to.meta.title || 'Project Manager'} — Project Manager`
  return true
})

export default router
