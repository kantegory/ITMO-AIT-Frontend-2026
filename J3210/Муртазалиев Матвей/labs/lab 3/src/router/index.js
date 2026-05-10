import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import DashboardView from "@/views/DashboardView.vue";
import HomeView from "@/views/HomeView.vue";
import IntegrationsView from "@/views/IntegrationsView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ReportsView from "@/views/ReportsView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/login", name: "login", component: LoginView, meta: { guestOnly: true } },
  { path: "/register", name: "register", component: RegisterView, meta: { guestOnly: true } },
  { path: "/dashboard", name: "dashboard", component: DashboardView, meta: { requiresAuth: true } },
  { path: "/reports", name: "reports", component: ReportsView, meta: { requiresAuth: true } },
  { path: "/integrations", name: "integrations", component: IntegrationsView, meta: { requiresAuth: true } },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to) => {
  const auth = useAuth();

  if (to.meta.requiresAuth) {
    try {
      await auth.ensureSession();
    } catch (error) {
      return { name: "login", query: { next: to.fullPath } };
    }
  }

  if (to.meta.guestOnly && auth.isAuthenticated.value) {
    return { name: "dashboard" };
  }

  return true;
});

export default router;
