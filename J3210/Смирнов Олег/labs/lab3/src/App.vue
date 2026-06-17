<script setup>
import { RouterView } from 'vue-router';
import AppNavbar from '@/components/layout/AppNavbar.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
</script>

<template>
  <a href="#main-content" class="skip-link">Перейти к основному содержимому</a>
  <AppNavbar />
  <RouterView />
  <AppFooter />
</template>
