import { createRouter, createWebHistory } from 'vue-router';
import CatalogView from '../views/CatalogView.vue';
import CourseView from '../views/CourseView.vue';
import LoginView from '../views/LoginView.vue';
import ProfileView from '../views/ProfileView.vue';
import RegisterView from '../views/RegisterView.vue';
import TeacherView from '../views/TeacherView.vue';
import { useAuth } from '../composables/useAuth';

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: CatalogView,
      meta: { title: 'Каталог курсов' },
    },
    {
      path: '/courses/:id',
      name: 'course',
      component: CourseView,
      meta: { title: 'Страница курса' },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Вход' },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { title: 'Регистрация' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { title: 'Личный кабинет', requiresAuth: true },
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: TeacherView,
      meta: { title: 'Кабинет преподавателя', requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth();
  document.title = `Omagad - ${to.meta.title || 'Vue SPA'}`;

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    };
  }

  return true;
});

export default router;
