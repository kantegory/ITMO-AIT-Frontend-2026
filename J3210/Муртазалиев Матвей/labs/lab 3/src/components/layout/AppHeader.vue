<template>
  <header class="site-header">
    <nav class="navbar navbar-expand-lg" aria-label="Основная навигация">
      <div class="container">
        <RouterLink class="navbar-brand brand-mark" to="/">FinFlow</RouterLink>
        <button
          class="navbar-toggler border-0 shadow-none"
          type="button"
          aria-controls="mainNav"
          :aria-expanded="String(isMenuOpen)"
          aria-label="Переключить навигацию"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div id="mainNav" class="collapse navbar-collapse" :class="{ show: isMenuOpen }">
          <ul v-if="isAuthenticated" class="navbar-nav mx-auto gap-lg-2">
            <li class="nav-item"><RouterLink class="nav-link" to="/">Главная</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/dashboard">Кабинет</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/reports">Отчёты</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/integrations">Интеграции</RouterLink></li>
          </ul>
          <div class="d-flex gap-2 flex-wrap ms-lg-auto justify-content-lg-end">
            <ThemeToggle />
            <template v-if="isAuthenticated">
              <RouterLink class="btn btn-outline-dark btn-sm px-3" to="/dashboard">Кабинет</RouterLink>
              <button class="btn btn-accent btn-sm px-3" type="button" @click="handleLogout">Выйти</button>
            </template>
            <template v-else>
              <RouterLink class="btn btn-outline-dark btn-sm px-3" to="/login">Войти</RouterLink>
              <RouterLink class="btn btn-accent btn-sm px-3" to="/register">Регистрация</RouterLink>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import ThemeToggle from "./ThemeToggle.vue";

const router = useRouter();
const auth = useAuth();
const { isAuthenticated } = auth;
const isMenuOpen = ref(false);

function handleLogout() {
  auth.logout();
  router.push("/login");
}
</script>

