<script setup>
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'

const { isAuthenticated } = useAuth()
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="row gy-4 align-items-center">
        <div class="col-lg-4">
          <RouterLink class="footer-brand d-inline-flex align-items-center gap-2" to="/">
            <span class="brand-mark"><i class="bi bi-globe2" /></span>
            <span>TripPlanner</span>
          </RouterLink>
          <p class="mt-3 mb-0">Учебное travel-приложение для планирования поездок, маршрутов и совместной работы.</p>
        </div>
        <div class="col-lg-5">
          <div class="d-flex flex-wrap gap-3">
            <RouterLink to="/">Главная</RouterLink>
            <RouterLink to="/destinations">Направления</RouterLink>
            <RouterLink v-if="isAuthenticated" to="/dashboard">Кабинет</RouterLink>
            <RouterLink v-if="isAuthenticated" to="/collaboration">Совместное планирование</RouterLink>
            <RouterLink v-if="!isAuthenticated" to="/login">Вход</RouterLink>
            <RouterLink v-if="!isAuthenticated" to="/register">Регистрация</RouterLink>
          </div>
        </div>
        <div class="col-lg-3 text-lg-end">
          <p class="mb-0">© 2026 TripPlanner</p>
        </div>
      </div>
    </div>
  </footer>
</template>
