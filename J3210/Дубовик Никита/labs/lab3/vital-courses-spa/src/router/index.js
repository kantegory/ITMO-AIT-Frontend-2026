import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/catalog',
    name: 'Catalog',
    component: () => import('@/views/CatalogView.vue')
  },
  {
    path: '/course/:id',
    name: 'Course',
    component: () => import('@/views/CourseView.vue'),
    props: true
  },
  {
    path: '/profile',
    name: 'StudentProfile',
    component: () => import('@/views/StudentProfileView.vue'),
    beforeEnter: (_to, _from) => {
      const auth = useAuthStore()
      if (!auth.isAuthenticated) {
        return { name: 'Home' }
      }
    }
  },
  {
    path: '/teacher-profile',
    name: 'TeacherProfile',
    component: () => import('@/views/TeacherProfileView.vue'),
    beforeEnter: (_to, _from) => {
      const auth = useAuthStore()
      if (!auth.isAuthenticated) {
        return { name: 'Home' }
      }
      if (auth.user?.role !== 'teacher') {
        return { name: 'Home' }
      }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
