import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import WorkspacesView from '../views/WorkspacesView.vue'
import CreateWorkspaceView from '../views/CreateWorkspaceView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/workspaces',
      name: 'workspaces',
      component: WorkspacesView
    },
    {
      path: '/create',
      name: 'create-workspace',
      component: CreateWorkspaceView
    }
  ]
})

export default router