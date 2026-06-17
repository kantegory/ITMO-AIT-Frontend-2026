<script setup>
import { computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useSession } from "../../composables/useSession";
import { useTheme } from "../../composables/useTheme";

const router = useRouter();
const { currentTheme, toggleTheme } = useTheme();
const { user, isAuthenticated, cabinetRouteName, logout, role } = useSession();

const themeLabel = computed(() => currentTheme.value === "dark" ? "тёмная" : "светлая");
const nextThemeLabel = computed(() => currentTheme.value === "dark" ? "светлую" : "тёмную");
const roleLabel = computed(() => role.value === "organizer" ? "Организатор" : "Покупатель");

function handleLogout() {
  logout();
  router.push({ name: "home" });
}
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-3" aria-label="Основная навигация">
      <div class="container">
        <RouterLink class="navbar-brand" to="/">Makar`s Event</RouterLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Переключить навигацию"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="mainNav" class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/events">Поиск мероприятий</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" :to="{ name: 'event-details', params: { id: 1 } }">
                Страница мероприятия
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" :to="{ name: 'user-cabinet' }">
                Кабинет пользователя
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" :to="{ name: 'organizer-cabinet' }">
                Кабинет организатора
              </RouterLink>
            </li>
          </ul>

          <div class="d-flex gap-2 align-items-center nav-actions">
            <button
              type="button"
              class="theme-toggle"
              :aria-label="`Текущая тема: ${themeLabel}. Нажмите, чтобы переключить на ${nextThemeLabel}.`"
              @click="toggleTheme"
            >
              Тема: {{ themeLabel }}
            </button>

            <template v-if="isAuthenticated">
              <span class="nav-user-chip">{{ user?.firstName }} · {{ roleLabel }}</span>
              <RouterLink class="btn btn-outline-light btn-sm" :to="{ name: cabinetRouteName }">Кабинет</RouterLink>
              <button type="button" class="btn btn-warning btn-sm" @click="handleLogout">Выйти</button>
            </template>

            <template v-else>
              <RouterLink class="btn btn-outline-light btn-sm" :to="{ name: 'login' }">Вход</RouterLink>
              <RouterLink class="btn btn-warning btn-sm" :to="{ name: 'register' }">Регистрация</RouterLink>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
