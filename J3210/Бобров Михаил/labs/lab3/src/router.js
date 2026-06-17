import { createRouter, createWebHashHistory } from "vue-router";
import { useSession } from "./composables/useSession.js";
import AppShell from "./components/AppShell.vue";
import DashboardView from "./views/DashboardView.vue";
import DatasetDetailsView from "./views/DatasetDetailsView.vue";
import ExploreView from "./views/ExploreView.vue";
import LoginView from "./views/LoginView.vue";
import ModelsView from "./views/ModelsView.vue";
import ModelDetailsView from "./views/ModelDetailsView.vue";
import DatasetsView from "./views/DatasetsView.vue";
import RegisterView from "./views/RegisterView.vue";
import SettingsView from "./views/SettingsView.vue";
import SubscriptionsView from "./views/SubscriptionsView.vue";
import SubscriptionDetailsView from "./views/SubscriptionDetailsView.vue";

const { isAuthenticated } = useSession();
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/login", component: LoginView, meta: { guest: true, title: "Вход" } },
        { path: "/register", component: RegisterView, meta: { guest: true, title: "Регистрация" } },
        {
            path: "/",
            component: AppShell,
            children: [
                { path: "", redirect: "/dashboard" },
                { path: "dashboard", component: DashboardView, meta: { title: "Личный кабинет" } },
                { path: "explore", component: ExploreView, meta: { title: "Исследовать ресурсы" } },
                { path: "models", component: ModelsView, meta: { title: "Мои модели" } },
                { path: "models/:id", component: ModelDetailsView, meta: { title: "Детали модели" } },
                { path: "datasets", component: DatasetsView, meta: { title: "Мои датасеты" } },
                { path: "datasets/:id", component: DatasetDetailsView, meta: { title: "Детали датасета" } },
                { path: "subscriptions", component: SubscriptionsView, meta: { title: "Подписки" } },
                { path: "subscriptions/:id", component: SubscriptionDetailsView, meta: { title: "Сообщество" } },
                { path: "settings", component: SettingsView, meta: { title: "Настройки" } }
            ]
        }
    ]
});

router.beforeEach(to => {
    if (to.meta.guest && isAuthenticated()) return "/dashboard";
    if (!to.meta.guest && !isAuthenticated()) return "/login";
    document.title = `DataPort - ${to.meta.title || "Dashboard"}`;
    return true;
});

export default router;
