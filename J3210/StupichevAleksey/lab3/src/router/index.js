import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from '@/stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('@/layout/BaseLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: 'course/:id',
        name: 'course-preview',
        component: () => import('@/views/course/CoursePreview.vue'),
      },
    ],
  },

  {
    path: '/sign-in',
    name: 'sign-in',
    component: () => import('@/views/SignInView.vue'),
    meta: {guestOnly: true},
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegistrationView.vue'),
    meta: {guestOnly: true},
  },

  {
    path: '/course/:id/learn',
    name: 'course-player',
    component: () => import('@/views/course/CoursePlayer.vue'),
    meta: {requiresAuth: true, role: 'student'},
  },

  {
    path: '/cabinet',
    component: () => import('@/layout/StudentLayout.vue'),
    meta: {requiresAuth: true, role: 'student'},
    children: [
      {
        path: '',
        name: 'view',
        component: () => import('@/views/student/View.vue'),
      },
      {
        path: 'courses',
        name: 'my-courses',
        component: () => import('@/views/student/MyCourses.vue'),
      },
      {
        path: 'favorites',
        name: 'favorites',
        component: () => import('@/views/student/Favorites.vue'),
      },
      {
        path: 'certificates',
        name: 'certificates',
        component: () => import('@/views/student/Certificates.vue'),
      },
    ],
  },

  {
    path: '/teacher',
    component: () => import('@/layout/TeacherLayout.vue'),
    meta: {requiresAuth: true, role: 'teacher'},
    children: [
      {
        path: '',
        name: 'teacher-courses',
        component: () => import('@/views/teacher/TeacherCourses.vue'),
      },
      {
        path: 'add',
        name: 'add-course',
        component: () => import('@/views/teacher/AddCourse.vue'),
      },
      {
        path: 'edit/:id',
        name: 'edit-course',
        component: () => import('@/views/teacher/EditCourse.vue'),
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {top: 0}
  },
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.guestOnly && auth.isLoggedIn) {
    return next(auth.isTeacher ? '/teacher' : '/cabinet')
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next('/sign-in')
  }

  if (to.meta.role === 'teacher' && auth.isLoggedIn && !auth.isTeacher) {
    return next('/cabinet')
  }

  if (to.meta.role === 'student' && auth.isLoggedIn && !auth.isStudent) {
    return next('/teacher')
  }

  next()
})

export default router
