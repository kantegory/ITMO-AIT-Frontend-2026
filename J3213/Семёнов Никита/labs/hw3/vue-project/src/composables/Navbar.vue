<template>
  <nav class="navbar navbar-expand-lg navbar-dark mb-4">
    <div class="container">
      <router-link class="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
        <svg class="icon"><use href="/img/sprite.svg#icon-wallet"></use></svg>
        Мои Финансы
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><router-link class="nav-link" to="/" active-class="active">Главная</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/transactions" active-class="active">Транзакции</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/reports" active-class="active">Отчеты</router-link></li>
        </ul>
        <div class="d-flex align-items-center gap-3">
          <span class="text-white fw-bold">{{ userName }}</span>
          <button @click="handleLogout" class="btn btn-outline-light btn-sm d-flex align-items-center gap-1">
            <svg class="icon"><use href="/img/sprite.svg#icon-logout"></use></svg>
            Выйти
          </button>
          <button @click="toggleTheme" class="btn btn-sm ms-2" :class="themeBtnClass">
            <svg class="icon"><use :href="`/img/sprite.svg#${themeIcon}`"></use></svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'

const { user, logout } = useAuth()
const { currentTheme, toggleTheme } = useTheme()

const userName = computed(() => user.value ? user.value.name : 'Загрузка...')
const themeIcon = computed(() => currentTheme.value === 'dark' ? 'icon-sun' : 'icon-moon')
const themeBtnClass = computed(() => currentTheme.value === 'dark' ? 'btn-outline-light' : 'btn-outline-light')

const handleLogout = () => {
  logout()
}
</script>