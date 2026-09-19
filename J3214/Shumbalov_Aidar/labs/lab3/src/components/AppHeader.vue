<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { isAuthenticated, logout, user } = useAuth();

function handleLogout() {
  logout();
  router.push({ name: 'catalog' });
}
</script>

<template>
  <header class="app-header">
    <RouterLink class="brand" :to="{ name: 'catalog' }" aria-label="Omagad, каталог курсов">
      <span class="brand-mark">O</span>
      <span>Omagad</span>
    </RouterLink>

    <nav aria-label="Основная навигация">
      <RouterLink :to="{ name: 'catalog' }">Курсы</RouterLink>
      <RouterLink :to="{ name: 'profile' }">Кабинет</RouterLink>
      <RouterLink :to="{ name: 'teacher' }">Преподавателю</RouterLink>
    </nav>

    <div class="header-actions">
      <span v-if="user" class="user-pill">{{ user.name }}</span>
      <RouterLink v-if="!isAuthenticated" class="ghost-button" :to="{ name: 'login' }">Вход</RouterLink>
      <RouterLink v-if="!isAuthenticated" class="primary-button" :to="{ name: 'register' }">Регистрация</RouterLink>
      <button v-else class="ghost-button" type="button" @click="handleLogout">Выйти</button>
    </div>
  </header>
</template>
