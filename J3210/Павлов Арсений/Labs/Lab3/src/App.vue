<script setup>
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <div class="main-shell">
    <AppHeader />

    <main class="container main-content">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>
