<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand text-warning" to="/dashboard">
        <svg class="icon me-1"><use href="/assets/sprite.svg#robot"></use></svg>
        InjectincoPlayground
      </router-link>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto" v-if="isAuthenticated">
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/dashboard">Дашборд</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/agents">Агенты и Фильтры</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/simulation">Симуляция</router-link>
          </li>
        </ul>
        <div class="d-flex align-items-center">
          <template v-if="isAuthenticated">
            <span class="text-light">{{ userEmail }}</span>
            <button @click="toggleTheme" class="btn btn-outline-warning ms-3">
              <svg class="icon">
                <use :href="currentTheme === 'dark' ? '/assets/sprite.svg#brightness-high-fill' : '/assets/sprite.svg#moon-fill'"></use>
              </svg>
            </button>
            <button @click="logout" class="btn btn-danger ms-2">Выход</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-light" active-class="active">Вход</router-link>
            <router-link to="/register" class="btn btn-primary ms-2" active-class="active">Регистрация</router-link>
            <button @click="toggleTheme" class="btn btn-outline-warning ms-3">
              <svg class="icon">
                <use :href="currentTheme === 'dark' ? '/assets/sprite.svg#brightness-high-fill' : '/assets/sprite.svg#moon-fill'"></use>
              </svg>
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'
import { useAuth } from '@/composables/useAuth'

const { currentTheme, toggleTheme } = useTheme()
const { userEmail, isAuthenticated, logout } = useAuth()
</script>
