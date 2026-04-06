<template>
  <nav class="navbar navbar-expand-lg navbar-dark custom-navbar mb-4">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" to="/dashboard">
        <svg class="icon me-2"><use href="#icon-book"></use></svg>EduPlatform
      </router-link>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard" active-class="active">
              <svg class="icon me-1"><use href="#icon-book"></use></svg>Мои курсы
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/search" active-class="active">
              <svg class="icon me-1"><use href="#icon-search"></use></svg>Поиск курсов
            </router-link>
          </li>
        </ul>
        <div class="d-flex align-items-center">
          <button @click="toggleTheme" class="theme-toggle-btn me-3 text-light">
  <svg class="icon">
    <use :href="theme === 'dark' ? '#icon-sun' : '#icon-theme'"></use>
  </svg>
</button>
          <span class="text-light me-3">{{ currentUser?.fullName }}</span>
          <a href="#" @click.prevent="logout" class="btn btn-outline-light btn-sm d-flex align-items-center">
            <svg class="icon me-1"><use href="#icon-logout"></use></svg>Выйти
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'
import { useTheme } from '../composables/useTheme'

const { currentUser, logout } = useAuth()
const { theme, toggleTheme } = useTheme()
</script>
