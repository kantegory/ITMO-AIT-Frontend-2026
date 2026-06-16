<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useTheme } from './composables/useTheme';

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>

<template>
  <RouterView />
</template>
