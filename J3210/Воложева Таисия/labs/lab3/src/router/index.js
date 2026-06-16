import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },

    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },

    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },

    {
      path: "/event/:id",
      name: "event-details",
      component: () => import("../views/EventDetailsView.vue"),
    },
    {
      path: "/event/:id",
      name: "event-details",
      component: () => import("../views/EventDetailsView.vue"),
    },
    {
      path: "/personal",
      name: "personal-account",
      component: () => import("../views/PersonalAccount.vue"),
    },
    {
      path: "/organizer",
      name: "organizer-account",
      component: () => import("../views/OrganizerAccount.vue"),
    },
  ],
});

export default router;
