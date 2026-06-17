<template>
  <a class="skip-link" href="#main-content">
    Перейти к основному содержимому
  </a>

  <div
    id="appStatus"
    class="visually-hidden"
    aria-live="polite"
    aria-atomic="true"
  ></div>

  <AppNavbar />

  <BaseLayout>
    <RouterView />
  </BaseLayout>

  <AppFooter />
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import BaseLayout from './layouts/BaseLayout.vue'
</script>