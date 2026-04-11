<template>
  <header class="site-header">
    <div class="container header-layout">
      <RouterLink class="logo" to="/">Online Courses</RouterLink>

      <nav class="nav" aria-label="Основная навигация">
        <RouterLink to="/">Главная</RouterLink>
        <RouterLink to="/courses">Курсы</RouterLink>
        <RouterLink v-if="!authenticated" to="/login">Вход</RouterLink>
        <RouterLink v-if="!authenticated" to="/register">Регистрация</RouterLink>
        <RouterLink v-if="authenticated" to="/profile">Кабинет</RouterLink>
      </nav>

      <button
        class="theme-toggle"
        type="button"
        :aria-pressed="isDark"
        :aria-label="isDark ? 'Включить светлую тему' : 'Включить темную тему'"
        @click="toggleTheme"
      >
        <span aria-hidden="true">Aa</span>
        <span>{{ isDark ? 'Светлая тема' : 'Темная тема' }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const { authenticated } = useAuth();
const isDark = ref(false);

function applyTheme(value) {
  isDark.value = value;
  document.body.classList.toggle('dark-theme', value);
  localStorage.setItem('theme', value ? 'dark' : 'light');
}

function toggleTheme() {
  applyTheme(!isDark.value);
}

onMounted(() => {
  applyTheme(localStorage.getItem('theme') === 'dark');
});
</script>
