import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('../pages/Landing.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../pages/Register.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/create-project',
    name: 'createProject',
    component: () => import('../pages/CreateProject.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/add-task',
    name: 'addTask',
    component: () => import('../pages/AddTask.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/project/:id',
    name: 'project',
    component: () => import('../pages/Project.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }

  next()
})

export default router