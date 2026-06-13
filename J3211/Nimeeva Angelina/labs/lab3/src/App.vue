<template>
  <div class="page-shell">
    <AppHeader />
    <RouterView />
    <AppFooter />
    <AppToast />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import AppToast from './components/AppToast.vue'
</script>
