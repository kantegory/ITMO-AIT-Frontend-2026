<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useTheme } from '../composables/useTheme';

const route = useRoute();
const router = useRouter();
const { user, logout } = useAuth();
const { toggleTheme } = useTheme();

const isGuestPage = computed(() => route.meta.guestPage);
const isAuthorized = computed(() => Boolean(user.value));

function logoutUser() {
  logout();
  router.push('/login');
}
</script>

<template>
  <nav v-if="!isGuestPage" class="navbar navbar-dark bg-dark navbar-expand-lg">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">
        Финансы от Михалыча
      </RouterLink>

      <ul class="navbar-nav ms-auto">
        <template v-if="isAuthorized">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/dashboard">
              <svg class="icon" aria-hidden="true"><use href="/sprite.svg#home" /></svg>
              Кабинет
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/transactions">
              <svg class="icon" aria-hidden="true"><use href="/sprite.svg#wallet" /></svg>
              Транзакции
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/reports">
              <svg class="icon" aria-hidden="true"><use href="/sprite.svg#chart" /></svg>
              Отчёты
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/integrations">
              <svg class="icon" aria-hidden="true"><use href="/sprite.svg#link" /></svg>
              Интеграции
            </RouterLink>
          </li>
        </template>

        <template v-else>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/login">Вход</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/register">Регистрация</RouterLink>
          </li>
        </template>

        <li class="nav-item ms-2">
          <button class="btn btn-sm btn-outline-light" type="button" @click="toggleTheme">
            Тема
          </button>
        </li>

        <li v-if="isAuthorized" class="nav-item ms-2">
          <button class="btn btn-sm btn-outline-light" type="button" @click="logoutUser">
            Выйти
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>
