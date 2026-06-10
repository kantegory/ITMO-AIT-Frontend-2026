<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import ToastContainer from './components/ToastContainer.vue'

const route = useRoute()
const isAuthLayout = computed(() => route.meta.layout === 'auth')
</script>

<template>
  <template v-if="isAuthLayout">
    <main id="main-content" tabindex="-1">
      <router-view />
    </main>
  </template>

  <template v-else>
    <AppNavbar />
    <main id="main-content" tabindex="-1">
      <router-view />
    </main>
    <AppFooter />
  </template>

  <ToastContainer />
</template>
