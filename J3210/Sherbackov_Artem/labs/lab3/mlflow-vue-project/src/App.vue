<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const setTheme = () => {
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
    
    document.documentElement.setAttribute('data-bs-theme', preferredTheme);
  };

  setTheme();

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);
});
</script>

<template>
  <router-view />
</template>