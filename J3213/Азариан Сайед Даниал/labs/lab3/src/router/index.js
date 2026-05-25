import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import EventView from '../views/EventView.vue'
import ProfileView from '../views/ProfileView.vue'
import OrganizerView from '../views/OrganizerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'EventPass - Главная' },
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { title: 'EventPass - Вход и регистрация' },
    },
    {
      path: '/events/:eventId',
      name: 'event',
      component: EventView,
      meta: { title: 'EventPass - Мероприятие' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { title: 'EventPass - Личный кабинет' },
    },
    {
      path: '/organizer',
      name: 'organizer',
      component: OrganizerView,
      meta: { title: 'EventPass - Кабинет организатора' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.afterEach((to) => {
  document.title = to.meta.title || 'EventPass'
})

export default router
