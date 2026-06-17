<script setup>
import { onMounted } from 'vue';
import AppNavbar from './components/AppNavbar.vue';
import { useTheme } from './composables/useTheme';

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>

<template>
  <AppNavbar />

  <main id="main-content">
    <RouterView />
  </main>
</template>
