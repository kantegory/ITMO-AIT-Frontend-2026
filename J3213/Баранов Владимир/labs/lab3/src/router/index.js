import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth.js";

const routes = [
    { path: "/", name: "home", component: () => import("@/views/HomeView.vue") },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/LoginView.vue"),
        meta: { guestOnly: true },
    },
    {
        path: "/register",
        name: "register",
        component: () => import("@/views/RegisterView.vue"),
        meta: { guestOnly: true },
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/DashboardView.vue"),
        meta: { requireAuth: true },
    },
    {
        path: "/experiments",
        name: "experiments",
        component: () => import("@/views/ExperimentsView.vue"),
        meta: { requireAuth: true },
    },
    {
        path: "/experiments/:id",
        name: "experiment-detail",
        component: () => import("@/views/ExperimentDetailView.vue"),
        meta: { requireAuth: true },
        props: true,
    },
    {
        path: "/models",
        name: "models",
        component: () => import("@/views/ModelsView.vue"),
        meta: { requireAuth: true },
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to) => {
    const { isAuthenticated } = useAuth();
    if (to.meta.requireAuth && !isAuthenticated.value) {
        return { name: "login", query: { redirect: to.fullPath } };
    }
    if (to.meta.guestOnly && isAuthenticated.value) {
        return { name: "dashboard" };
    }
    return true;
});

export default router;
