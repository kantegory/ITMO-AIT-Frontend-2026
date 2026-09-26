import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage.vue')
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: () => import('../views/TicketsPage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/AuthLogin.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/AuthRegister.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/UserDashboard.vue')
    },
    {
      path: '/ticket/:id',
      name: 'ticket-details',
      component: () => import('../views/TicketDetails.vue')
    }
  ]
})

export default router
