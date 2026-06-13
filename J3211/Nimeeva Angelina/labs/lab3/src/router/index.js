import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import SearchView from '../views/SearchView.vue'
import TenantView from '../views/TenantView.vue'
import AdminView from '../views/AdminView.vue'
import ArchiveView from '../views/ArchiveView.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/search', component: SearchView },
  { path: '/tenant', component: TenantView, meta: { requiresRole: 'tenant' } },
  { path: '/admin', component: AdminView, meta: { requiresRole: 'admin' } },
  { path: '/archive', component: ArchiveView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const { role } = useAuth()
  if (to.meta.requiresRole && role.value !== to.meta.requiresRole) return '/'
  if (to.meta.requiresAuth && !role.value) return '/'
})

export default router
