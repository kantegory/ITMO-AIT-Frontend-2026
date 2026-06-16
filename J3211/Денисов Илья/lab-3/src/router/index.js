import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '../views/LandingView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import TasksView from '../views/TasksView.vue';
import AccountView from '../views/AccountView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import { getStoredCurrentUser } from '../services/authStorage';

const routes = [
  {
    path: '/',
    name: 'home',
    component: LandingView,
    meta: { guestOnly: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guestOnly: true }
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TasksView,
    meta: { requiresAuth: true }
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const currentUser = getStoredCurrentUser();

  if (to.meta.requiresAuth && !currentUser) {
    return { name: 'login' };
  }

  if (to.meta.guestOnly && currentUser) {
    return { name: 'tasks' };
  }

  return true;
});

export default router;
