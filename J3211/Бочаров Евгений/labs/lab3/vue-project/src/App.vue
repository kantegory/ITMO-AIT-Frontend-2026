<template>
  <NavBar :isDark="isDark" @toggle-theme="toggleTheme" />
  <main class="container my-4">
    <router-view />
  </main>
  <AppFooter />
</template>

<script setup>
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'
import NavBar from '@/components/layout/NavBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const { isDark, toggleTheme, init } = useTheme()
onMounted(init)
</script>