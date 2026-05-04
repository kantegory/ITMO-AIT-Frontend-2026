import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/register',
    component: () => import('../views/RegisterView.vue'),
  },
  {
    path: '/',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/experiments',
    component: () => import('../views/ExperimentsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/experiments/:id',
    component: () => import('../views/ExperimentDetailsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/models',
    component: () => import('../views/ModelsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const user = localStorage.getItem('currentUser')
  if (to.meta.requiresAuth && !user) return '/login'
  if ((to.path === '/login' || to.path === '/register') && user) return '/'
})

export default router
