<template>
  <ThemeToggle fixed />
  <main class="auth-page">
    <div class="auth-card text-center">
      <router-link to="/login" class="brand brand-hero text-decoration-none d-inline-block mb-4" aria-label="67 Финансы — на главную">67 Финансы</router-link>
      <h1 class="h2">Управление личными финансами</h1>
      <p class="subtitle">Следите за счетами, транзакциями и бюджетом в одном месте</p>
      <div class="d-flex gap-2 justify-content-center flex-wrap" role="navigation" aria-label="Действия">
        <router-link to="/login" class="btn btn-primary px-4">Войти</router-link>
        <router-link to="/register" class="btn btn-outline-secondary px-4">Регистрация</router-link>
        <router-link to="/dashboard" class="btn btn-outline-secondary px-4">Личный кабинет</router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
import ThemeToggle from '../components/ThemeToggle.vue'
</script>
