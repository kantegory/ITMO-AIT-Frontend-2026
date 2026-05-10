<template>
  <RouterView />
  <ThemeToggle />
  <ToastHost />
</template>

<script setup>
import ThemeToggle from './components/ThemeToggle.vue';
import ToastHost from './components/ToastHost.vue';
</script>
