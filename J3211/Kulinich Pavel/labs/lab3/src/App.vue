<script setup>
import AppNavbar from './components/AppNavbar.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const isAuthPage = computed(() => ['login', 'register'].includes(route.name));
</script>

<template>
  <div :class="{ 'auth-page': isAuthPage }">
    <AppNavbar />
    <router-view />
  </div>
</template>
