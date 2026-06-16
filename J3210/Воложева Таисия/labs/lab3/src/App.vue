<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push("/");
};
</script>

<template>
  <header class="navbar navbar-expand-lg border-bottom" role="banner">
    <div class="container position-relative">
      <!-- Название сайта по центру -->
      <div class="d-flex justify-content-center w-100">
        <router-link
          class="fw-bold text-rose text-decoration-none m-0"
          to="/"
          aria-label="Titickets — Главная страница"
          style="font-size: 2rem; color: var(--rose)"
        >
          Titickets
        </router-link>
      </div>

      <!-- Кнопки управления справа (прижаты к правому краю) -->
      <div
        id="auth-buttons"
        class="position-absolute end-0 top-50 translate-middle-y d-flex align-items-center"
      >
        <!-- Если не авторизован — показываем кнопки Входа и Регистрации -->
        <template v-if="!auth.isLoggedIn">
          <router-link to="/login" class="btn btn-outline-rose me-2 px-4"> Вход </router-link>
          <router-link to="/register" class="btn btn-rose px-4"> Регистрация </router-link>
        </template>

        <!-- Если авторизован — показываем имя и кнопки кабинета/выхода -->
        <template v-else>
          <span class="me-3 text-muted small">
            <i class="bi bi-person-circle me-1"></i>
            {{ auth.user.name || auth.user.email }}
          </span>
          <router-link
            :to="auth.user.role === 'organizer' ? '/organizer' : '/personal'"
            class="btn btn-outline-rose me-2 px-3"
          >
            Личный кабинет
          </router-link>
          <button @click="handleLogout" class="btn btn-outline-secondary px-3">Выйти</button>
        </template>
      </div>
    </div>
  </header>

  <main class="container my-5" id="main-content">
    <router-view />
  </main>

  <footer class="border-top text-center py-4 mt-auto">
    <div class="container">
      <p class="text-muted small mb-0">
        © 2026 Titickets. Все права защищены. Сервис покупки билетов на мероприятия.
      </p>
    </div>
  </footer>
</template>
