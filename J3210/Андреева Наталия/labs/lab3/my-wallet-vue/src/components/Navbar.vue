<template>
  <nav class="navbar navbar-dark px-3 mb-4 shadow-sm" aria-label="Верхнее меню">
    <div class="container-fluid d-flex align-items-center">
      <router-link class="navbar-brand fw-bold" to="/">MyWallet</router-link>
      <div class="d-flex align-items-center ms-auto">
        <router-link to="/" class="nav-link-custom me-2" active-class="active">
          <svg class="svg-icon">
            <use href="/sprite.svg#icon-home"></use>
          </svg>
          Главная
        </router-link>
        <router-link to="/search" class="nav-link-custom me-2" active-class="active">
          <svg class="svg-icon">
            <use href="/sprite.svg#icon-search"></use>
          </svg>
          Поиск
        </router-link>
        <router-link to="/reports" class="nav-link-custom me-2" active-class="active">
          <svg class="svg-icon">
            <use href="/sprite.svg#icon-reports"></use>
          </svg>
          Аналитика
        </router-link>
        <router-link to="/bank" class="nav-link-custom me-3" active-class="active">
          <svg class="svg-icon">
            <use href="/sprite.svg#icon-bank"></use>
          </svg>
          Банк
        </router-link>

        <button class="btn theme-toggle-btn btn-sm fw-bold me-3" @click="toggleTheme">
          ТЕМА: {{ isDark ? 'ТЕМНАЯ' : 'СВЕТЛАЯ' }}
        </button>

        <span class="me-3 d-none d-sm-flex userNameDisplay">{{ userName }}</span>

        <button class="btn btn-logout btn-sm fw-bold border-0" @click="logout">
          <svg class="svg-icon" style="margin-right: 5px;">
            <use href="/sprite.svg#icon-logout"></use>
          </svg>
          Выйти
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import {computed} from 'vue'
import {useAuth} from '../composables/useAuth'
import {useTheme} from '../composables/useTheme'

const {logout} = useAuth()
const {isDark, toggleTheme} = useTheme()
const userName = computed(() => localStorage.getItem('userFullName') || '')
</script>