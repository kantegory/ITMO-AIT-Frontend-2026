<template>
  <nav class="navbar navbar-expand-lg sticky-top glass-navbar" aria-label="Основная навигация">
    <div class="container-fluid custom-container px-4 px-md-5">
      <router-link class="navbar-brand d-flex align-items-center gap-2 fw-bold letter-spacing-2" to="/">
        <svg class="icon icon-logo" aria-hidden="true" focusable="false">
          <use href="#icon-logo"></use>
        </svg>
        <span class="ms-1"><span class="fw-bold">Nova</span><span class="fw-light">Transit</span></span>
      </router-link>


      <button
        class="navbar-toggler shadow-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Переключить меню навигации"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-4">
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/">
              <span class="fw-bold me-1 text-main" aria-hidden="true">00</span> Главная
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/#catalog">
              <span class="fw-bold me-1 text-main" aria-hidden="true">01</span> Маршруты
            </router-link>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <router-link class="nav-link" active-class="active" to="/dashboard">
              <span class="fw-bold me-1 text-main" aria-hidden="true">02</span> Кабинет
            </router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-3 mt-4 mt-lg-0">
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="nav-link letter-spacing-2 text-uppercase" style="font-size: 0.75rem;">
              Войти
            </router-link>
            <router-link to="/register" class="btn btn-accent" style="font-size: 0.85rem; padding: 0.4rem 1rem;">
              Регистрация
            </router-link>
          </template>

          <template v-else>
            <router-link to="/dashboard" class="profile-nav-btn ms-2" :aria-label="`Личный кабинет: ${user.name}`">
              <img
                :src="user.avatarUrl"
                :alt="`Аватар: ${user.name}`"
                width="24"
                height="24"
                class="rounded-circle"
              >
              <span class="d-none d-sm-inline">{{ user.name }}</span>
            </router-link>
          </template>

          <ThemeToggle />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from '../../composables/useAuth'
import ThemeToggle from './ThemeToggle.vue'

const { user, isAuthenticated } = useAuth()
</script>