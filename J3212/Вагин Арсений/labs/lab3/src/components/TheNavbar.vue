<template>
  <nav class="navbar navbar-expand-lg sticky-top border-bottom">
    <div class="container">
      <router-link class="navbar-brand" to="/">CONSISTENT AIR</router-link>
      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Открыть навигацию">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item"><router-link class="nav-link" to="/catalog">Каталог</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/collections">Коллекции</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/about">О бренде</router-link></li>

          <li class="nav-item ms-lg-4">
            <a class="nav-link d-flex align-items-center gap-2" href="#" @click.prevent="toggleTheme" aria-label="Переключить темную/светлую тему">
              <svg class="nav-icon" aria-hidden="true"><use href="#icon-theme"></use></svg>
              <span class="d-lg-none">Тема</span>
            </a>
          </li>
          
          <li class="nav-item">
            <router-link class="nav-link d-flex align-items-center gap-2" :to="currentUser ? '/profile' : '/login'" aria-label="Личный кабинет">
              <svg class="nav-icon" aria-hidden="true"><use href="#icon-profile"></use></svg>
              <span class="d-lg-none">Профиль</span>
            </router-link>
          </li>
          
          <li class="nav-item" v-if="currentUser">
            <a class="nav-link d-flex align-items-center gap-2 text-danger" href="#" @click.prevent="logout" style="color: var(--accent-red) !important;" aria-label="Выйти из аккаунта">
              <svg class="nav-icon" aria-hidden="true"><use href="#icon-logout"></use></svg>
              <span class="d-lg-none">Выйти</span>
            </a>
          </li>
          
          <li class="nav-item">
            <router-link class="nav-link d-flex align-items-center gap-2" to="/cart" aria-label="Корзина">
              <svg class="nav-icon" aria-hidden="true"><use href="#icon-cart"></use></svg>
              <span class="d-lg-none">Корзина</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'
const { currentUser, logout } = useAuth()

const toggleTheme = () => {
  let theme = document.documentElement.getAttribute('data-theme')
  let newTheme = theme === 'dark' ? 'light' : 'dark'
  
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}
</script>