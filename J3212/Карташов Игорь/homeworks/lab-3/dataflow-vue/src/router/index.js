import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { guest: true },
    },
    {
      path: '/',
      name: 'pipelines',
      component: () => import('../views/PipelinesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pipelines/:id',
      name: 'pipeline-detail',
      component: () => import('../views/PipelineDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to) => {
  const userId = localStorage.getItem('userId')

  if (to.meta.requiresAuth && !userId) {
    return { name: 'login' }
  }

  if (to.meta.guest && userId) {
    return { name: 'pipelines' }
  }
})

export default router
