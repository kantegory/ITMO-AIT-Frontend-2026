<template>
  <a class="skip-link" href="#pageRoot">Перейти к основному содержимому</a>
  <div class="app-layout">
    <AppSidebar />
    <div class="app-content">
      <AppHeader :title="title" :subtitle="subtitle" />
      <main class="container-fluid py-4" id="pageRoot" tabindex="-1">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue';
import AppSidebar from './AppSidebar.vue';

defineProps({
  title: {
    type: String,
    default: 'Tarelka'
  },
  subtitle: {
    type: String,
    default: 'Vue SPA'
  }
});
</script>
