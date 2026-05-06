import { createRouter, createWebHashHistory } from 'vue-router'
import { isAuthorized } from '@/stores/auth.js'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { guest: true } },
    { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue'), meta: { guest: true } },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { auth: true } },
    { path: '/project/:id', name: 'project', component: () => import('@/views/ProjectView.vue'), meta: { auth: true } },
    { path: '/search', name: 'search', component: () => import('@/views/SearchView.vue'), meta: { auth: true } },
    { path: '/faq', name: 'faq', component: () => import('@/views/FaqView.vue'), meta: { auth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const ok = isAuthorized()
  if (to.meta.auth && !ok) return { name: 'login' }
  if (to.meta.guest && ok) return { name: 'dashboard' }
})

export default router
