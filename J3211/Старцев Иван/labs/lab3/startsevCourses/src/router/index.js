import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/courses',
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('@/views/CoursesView.vue'),
    },
    {
      path: '/courses/:id',
      name: 'course',
      component: () => import('@/views/CourseView.vue'),
      props: true,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/my-courses',
      name: 'my-courses',
      component: () => import('@/views/MyCoursesView.vue'),
    },
    {
      path: '/my-learning',
      name: 'my-learning',
      component: () => import('@/views/MyLearningView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/lesson/:id',
      name: 'lesson',
      component: () => import('@/views/LessonView.vue'),
      props: true,
    },
  ],
})

export default router

// export const routerGuard = router.beforeEach((to, from, next) => {
//   const isLoggedIn = localStorage.getItem('token')
//   if (to.name === 'login' || to.name === 'register') {
//     if (isLoggedIn) {
//       next('/')
//     } else {
//       next()
//     }
//   } else {
//     if (isLoggedIn) {}
//   }
// })
