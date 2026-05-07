import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import WorkspacesView from '@/views/WorkspacesView.vue'
import WorkspacePageView from '@/views/WorkspacePageView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CommunityView from '@/views/CommunityView.vue'
import SearchView from '@/views/SearchView.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/workspaces', component: WorkspacesView, meta: { requiresAuth: true } },
  { path: '/workspaces/:id', component: WorkspacePageView, meta: { requiresAuth: true } },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/community', component: CommunityView, meta: { requiresAuth: true } },
  { path: '/search', component: SearchView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.currentUser) {
    return '/login'
  }
})

export default router