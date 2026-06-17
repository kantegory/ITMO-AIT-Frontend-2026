<template>
  <div :data-theme="theme" class="app-container">
    <header v-if="isAuthenticated">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div class="container-fluid">
          <span class="navbar-brand fw-bold">Finance ITMO</span>
          <div class="d-flex align-items-center">
            <button @click="toggleTheme" class="btn btn-outline-light btn-sm me-3">Тема</button>
            <span class="text-white">Татьяна М.</span>
          </div>
        </div>
      </nav>
    </header>

    <router-view />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFinance } from './composables/useFinance'

const theme = ref(localStorage.getItem('theme') || 'light')
const { isAuthenticated } = useFinance()

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
}
</script>

<style>
/* Глобальные переменные стилей темы */
[data-theme="dark"] {
  background-color: #121212;
  color: #f8f9fa;
}
[data-theme="dark"] .card {
  background-color: #1e1e1e;
  color: #f8f9fa;
}
[data-theme="dark"] .table {
  color: #f8f9fa;
}
</style>