<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-success">
    <div class="container">
      <span class="navbar-brand">
        <svg class="icon"><use xlink:href="/sprite.svg#icon-compass"></use></svg>
        FlyingOwl
      </span>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/login" :class="{ active: $route.path === '/login' }">Вход</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/register" :class="{ active: $route.path === '/register' }">Регистрация</RouterLink>
          </li>
          <li class="nav-item">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </div>
  </nav>
  
  <main>
    <slot />
  </main>
  
  <footer class="bg-light py-4 mt-5">
    <div class="container text-center">
      <p class="mb-0">&copy; 2026 FlyingOwl.</p>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const route = useRoute()
</script>