import { nextTick } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { session } from '../composables/useSession.js';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/explore' },
    {
      path: '/explore',
      component: () => import('../views/ExploreView.vue'),
      meta: { title: 'Explore resources' },
    },
    {
      path: '/resources/:id',
      component: () => import('../views/ResourceView.vue'),
      meta: { title: 'Resource' },
    },
    {
      path: '/login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Log in' },
    },
    {
      path: '/register',
      component: () => import('../views/RegisterView.vue'),
      meta: { title: 'Create an account' },
    },
    {
      path: '/profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { title: 'Your library', requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: 'Page not found' },
    },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) {
      return saved;
    }

    if (to.path !== from.path) {
      return { top: 0 };
    }
  },
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !session.value) {
    return { path: '/login', query: { returnTo: to.fullPath } };
  }
});
router.afterEach(async (to, from, failure) => {
  if (failure) {
    return;
  }

  document.title = `${to.meta.title} · AxonHub`;

  if (to.path === from.path) {
    return;
  }

  await nextTick();
  document.querySelector('main h1')?.focus({ preventScroll: true });
});
