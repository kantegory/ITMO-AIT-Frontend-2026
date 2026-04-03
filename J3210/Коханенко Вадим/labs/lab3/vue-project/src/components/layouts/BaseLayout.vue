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
            <RouterLink class="nav-link" to="/search">
              <svg class="icon"><use xlink:href="/sprite.svg#icon-search"></use></svg>
              Поиск
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/dashboard">
              <svg class="icon"><use xlink:href="/sprite.svg#icon-person-circle"></use></svg>
              Личный кабинет
            </RouterLink>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="logout">
              Выйти
            </a>
          </li>
          <li class="nav-item">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </div>
  </nav>
  
  <main class="container mb-5">
    <slot />
  </main>
  
  <footer class="bg-light py-4 mt-5">
    <div class="container text-center">
      <p class="mb-0">&copy; 2026 FlyingOwl.</p>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()
</script>