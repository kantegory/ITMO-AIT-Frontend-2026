import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterPage.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/course/:id',
      name: 'course',
      component: () => import('@/views/CoursePage.vue')
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: () => import('@/views/TeacherPage.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('learnify_token')
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router