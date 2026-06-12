<template>
  <button 
    @click="toggleTheme" 
    class="btn btn-outline-secondary btn-sm d-inline-flex align-items-center" 
    :aria-label="isDark ? 'Включить светлую тему' : 'Включить тёмную тему'"
    :title="isDark ? 'Включить светлую тему' : 'Включить тёмную тему'"
  >
    <i :class="isDark ? 'bi bi-sun-fill me-2' : 'bi bi-moon-fill me-2'" aria-hidden="true"></i>
    <span>{{ isDark ? 'Светлая тема' : 'Тёмная тема' }}</span>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.setAttribute('data-theme', 'dark');
  }
});
</script>