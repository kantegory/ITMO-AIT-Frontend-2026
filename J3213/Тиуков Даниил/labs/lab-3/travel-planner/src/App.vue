<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import { useTheme } from '@/composables/useTheme.js'

useTheme()
</script>

<template>
  <a class="visually-hidden-focusable" href="#main-content">Перейти к основному содержимому</a>
  <AppNavbar />
  <main id="main-content">
    <RouterView />
  </main>
  <AppFooter />
  <ToastContainer />
</template>
