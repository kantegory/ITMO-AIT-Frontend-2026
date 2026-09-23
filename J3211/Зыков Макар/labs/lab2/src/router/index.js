import { createRouter, createWebHashHistory } from "vue-router";
import { useSession } from "../composables/useSession";
import EventDetailsPage from "../pages/EventDetailsPage.vue";
import EventsPage from "../pages/EventsPage.vue";
import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";
import OrganizerCabinetPage from "../pages/OrganizerCabinetPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import UserCabinetPage from "../pages/UserCabinetPage.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: {
      title: "Makar`s Event | Главная"
    }
  },
  {
    path: "/events",
    name: "events",
    component: EventsPage,
    meta: {
      title: "Makar`s Event | Поиск мероприятий"
    }
  },
  {
    path: "/events/:id",
    name: "event-details",
    component: EventDetailsPage,
    meta: {
      title: "Makar`s Event | Страница мероприятия"
    }
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: {
      title: "Makar`s Event | Вход",
      guestOnly: true
    }
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
    meta: {
      title: "Makar`s Event | Регистрация",
      guestOnly: true
    }
  },
  {
    path: "/cabinet/user",
    name: "user-cabinet",
    component: UserCabinetPage,
    meta: {
      title: "Makar`s Event | Кабинет пользователя",
      requiresAuth: true,
      roles: ["user"]
    }
  },
  {
    path: "/cabinet/organizer",
    name: "organizer-cabinet",
    component: OrganizerCabinetPage,
    meta: {
      title: "Makar`s Event | Кабинет организатора",
      requiresAuth: true,
      roles: ["organizer"]
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundPage,
    meta: {
      title: "Makar`s Event | Страница не найдена"
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to) => {
  const { isAuthenticated, role, cabinetRouteName } = useSession();

  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: cabinetRouteName.value };
  }

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: "login",
      query: { redirect: to.fullPath }
    };
  }

  if (to.meta.roles?.length && !to.meta.roles.includes(role.value)) {
    if (!isAuthenticated.value) {
      return { name: "login", query: { redirect: to.fullPath } };
    }

    return { name: cabinetRouteName.value };
  }

  return true;
});

router.afterEach((to) => {
  document.title = to.meta.title || "Makar`s Event | Vue SPA";
});

export default router;
