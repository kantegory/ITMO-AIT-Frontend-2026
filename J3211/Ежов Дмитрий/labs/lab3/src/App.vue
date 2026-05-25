<script setup lang="ts">
import { onMounted } from 'vue';
import { useTheme } from './composables/useTheme';

const { init } = useTheme();
onMounted(init);
</script>

<template>
  <RouterView />
</template>
