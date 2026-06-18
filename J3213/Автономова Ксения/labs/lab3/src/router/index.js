import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import SearchView from '../views/SearchView.vue'
import EventView from '../views/EventView.vue'
import DashboardView from '../views/DashboardView.vue'
import OrganizerView from '../views/OrganizerView.vue'
const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { guest: true } },
  { path: '/login', name: 'login', component: LoginView, meta: { guest: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { guest: true } },
  { path: '/search', name: 'search', component: SearchView, meta: { requiresAuth: true } },
  { path: '/event/:id', name: 'event', component: EventView, meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true, role: 'user' } },
  { path: '/organizer', name: 'organizer', component: OrganizerView, meta: { requiresAuth: true, role: 'organizer' } },
  { path: '/:pathMatch(.*)*', redirect: '/search' }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to) => {
  const { isAuthenticated, userRole } = useAuth()
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.role && userRole.value !== to.meta.role) {
    return userRole.value === 'organizer' ? { name: 'organizer' } : { name: 'dashboard' }
  }
  if (to.meta.guest && isAuthenticated.value && to.name !== 'home') {
    return userRole.value === 'organizer' ? { name: 'organizer' } : { name: 'dashboard' }
  }
  return true
})
export default router
