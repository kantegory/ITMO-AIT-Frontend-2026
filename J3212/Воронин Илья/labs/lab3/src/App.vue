<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppNavbar from './components/AppNavbar.vue';
import AppFooter from './components/AppFooter.vue';

const route = useRoute();
const showFooter = computed(() => route.meta.hideFooter !== true);
</script>

<template>
  <AppNavbar />
  <main class="flex-grow-1">
    <RouterView />
  </main>
  <AppFooter v-if="showFooter" />
</template>
