<template>
  <header role="banner">
    <nav class="navbar navbar-expand-lg navbar-dark mb-4" aria-label="Главная навигация сайта">
      <div class="container">
        <router-link class="navbar-brand fw-bold d-flex align-items-center gap-2" to="/" aria-label="На главную страницу Мои Финансы">
          <svg class="icon"><use href="/img/sprite.svg#icon-wallet"></use></svg>
          Мои Финансы
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Открыть меню навигации">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto" role="menubar">
            <li class="nav-item" role="presentation"><router-link class="nav-link" to="/" role="menuitem">Главная</router-link></li>
            <li class="nav-item" role="presentation"><router-link class="nav-link" to="/transactions" role="menuitem">Транзакции</router-link></li>
            <li class="nav-item" role="presentation"><router-link class="nav-link" to="/reports" role="menuitem">Отчеты</router-link></li>
          </ul>
          <div class="d-flex align-items-center gap-3">
            <span class="text-white fw-bold" aria-live="polite">{{ user?.name || 'Загрузка...' }}</span>
            <button class="btn btn-outline-light btn-sm d-flex align-items-center gap-1" @click="logout" aria-label="Выйти из учетной записи">
              <svg class="icon"><use href="/img/sprite.svg#icon-logout"></use></svg> Выйти
            </button>
            <button class="btn btn-outline-light btn-sm ms-2" @click="toggleTheme" aria-label="Переключить тему" title="Сменить тему">
              <svg class="icon"><use :href="`/img/sprite.svg#icon-${currentTheme === 'dark' ? 'sun' : 'moon'}`"></use></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'

const { user, logout } = useAuth()
const { currentTheme, toggleTheme } = useTheme()
</script>