<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const route = useRoute();
const router = useRouter();
const auth = useAuth();

const guestLinks = [
  { name: 'home', label: 'Главная' },
  { name: 'login', label: 'Вход' },
  { name: 'register', label: 'Регистрация' },
];

const privateLinks = [
  { name: 'dashboard', label: 'Кабинет' },
  { name: 'transactions', label: 'Транзакции' },
  { name: 'report', label: 'Отчеты' },
  { name: 'integrations', label: 'Интеграции' },
];

const navLinks = computed(() => (auth.isAuthenticated.value ? privateLinks : guestLinks));

function isActive(name) {
  return route.name === name;
}

function onLogout() {
  auth.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <header class="app-navbar">
    <div class="container navbar-inner">
      <RouterLink class="navbar-brand" :to="auth.isAuthenticated.value ? '/dashboard' : '/'">
        <span class="brand-dot" aria-hidden="true"></span>
        FinTrack Pro
      </RouterLink>

      <nav class="nav-links" aria-label="Основная навигация">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="{ name: link.name }"
          class="nav-link"
          :class="{ active: isActive(link.name) }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="nav-actions">
        <span v-if="auth.isAuthenticated.value" class="user-chip" :title="auth.userName.value">
          {{ auth.userName.value }}
        </span>
        <button v-if="auth.isAuthenticated.value" class="btn btn-sm btn-outline-accent" type="button" @click="onLogout">
          Выйти
        </button>
      </div>
    </div>
  </header>
</template>
