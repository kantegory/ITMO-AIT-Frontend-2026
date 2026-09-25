import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'models',
      component: () => import('../views/ModelsView.vue')
    },
    {
      path: '/datasets',
      name: 'datasets',
      component: () => import('../views/DatasetsView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/model/:type/:id',
      name: 'model-detail',
      component: () => import('../views/ModelDetailView.vue')
    }
  ]
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('user')) {
    return { name: 'login' }
  }
})

export default router
