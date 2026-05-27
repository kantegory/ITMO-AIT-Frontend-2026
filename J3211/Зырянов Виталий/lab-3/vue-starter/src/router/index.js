import { createRouter, createWebHashHistory } from 'vue-router'
import { useSession } from '../composables/useSession'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import SearchView from '../views/SearchView.vue'
import ProfileView from '../views/ProfileView.vue'
import ModelView from '../views/ModelView.vue'

const routes = [
  { path: '/', redirect: '/search' },
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },
  { path: '/search', name: 'search', component: SearchView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/model/:id(\\d+)', name: 'model', component: ModelView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/search' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  const { isAuthenticated } = useSession()

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'login',
      query: { returnTo: to.fullPath }
    }
  }

  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: 'search' }
  }

  return true
})

export default router
