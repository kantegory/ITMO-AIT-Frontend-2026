import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const HomeView = () => import('../views/HomeView.vue')
const CatalogView = () => import('../views/CatalogView.vue')
const CourseView = () => import('../views/CourseView.vue')
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const ProfileView = () => import('../views/ProfileView.vue')
const TeacherView = () => import('../views/TeacherView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'MokiichukKnowledge' } },
  { path: '/catalog', name: 'catalog', component: CatalogView, meta: { title: 'Каталог курсов' } },
  { path: '/course/:id', name: 'course', component: CourseView, props: true, meta: { title: 'Курс' } },
  { path: '/login', name: 'login', component: LoginView, meta: { title: 'Вход', layout: 'auth' } },
  { path: '/register', name: 'register', component: RegisterView, meta: { title: 'Регистрация', layout: 'auth' } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { title: 'Личный кабинет', requiresAuth: true } },
  { path: '/teacher', name: 'teacher', component: TeacherView, meta: { title: 'Кабинет преподавателя', requiresAuth: true, requiresTeacher: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { title: 'Страница не найдена' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  const { currentUser, isTeacher } = useAuth()

  if (to.meta.requiresAuth && !currentUser.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresTeacher && !isTeacher.value) {
    return { name: 'login' }
  }
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} — MokiichukKnowledge`
  }
})

export default router
