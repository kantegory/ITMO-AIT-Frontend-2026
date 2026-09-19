import { createRouter, createWebHistory } from "vue-router";
import pinia from "../stores";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: "/",
      name: "destinations",
      component: () => import("../views/DestinationsView.vue")
    },
    {
      path: "/destination/:id",
      name: "destination",
      component: () => import("../views/DestinationView.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: { guestOnly: true }
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
      meta: { guestOnly: true }
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/ProfileView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/trip",
      name: "trip",
      component: () => import("../views/TripView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue")
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue")
    }
  ]
});

router.beforeEach((to) => {
  const authStore = useAuthStore(pinia);

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: "profile" };
  }

  return true;
});

export default router;
