import { createRouter, createWebHistory } from 'vue-router';
import EventDetailsView from '../views/EventDetailsView.vue';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import OrdersView from '../views/OrdersView.vue';
import OrganizerView from '../views/OrganizerView.vue';
import ProfileView from '../views/ProfileView.vue';
import RegisterView from '../views/RegisterView.vue';
import { useAuth } from '../composables/useAuth';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/events/:id', name: 'event-details', component: EventDetailsView },
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },
  { path: '/orders', name: 'orders', component: OrdersView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/organizer', name: 'organizer', component: OrganizerView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth();
  const authenticated = isAuthenticated.value;

  if (to.meta.requiresAuth && !authenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath
      }
    };
  }

  if (to.meta.guestOnly && authenticated) {
    return { name: 'home' };
  }

  return true;
});

export default router;
