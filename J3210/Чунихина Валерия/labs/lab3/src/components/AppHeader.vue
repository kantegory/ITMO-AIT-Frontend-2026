<template>
  <nav class="navbar navbar-expand-lg navbar-light sticky-top shadow-sm" aria-label="Основная навигация">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/" aria-label="AIBloom, перейти на главную страницу">
        <svg class="brand-flower ui-icon ui-icon-lg" aria-hidden="true">
          <use href="/sprite.svg#icon-flower"></use>
        </svg>
        <span class="ms-2">AIBloom</span>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Открыть меню навигации"
      >
        <span class="navbar-toggler-icon" aria-hidden="true"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav ms-auto align-items-center">
          <RouterLink class="nav-link mx-2" to="/">Поиск</RouterLink>
          <RouterLink class="nav-link mx-2" to="/login">Вход</RouterLink>
          <button type="button" class="btn btn-outline-primary ms-lg-3 theme-toggle">
            Тёмная тема
          </button>
          <RouterLink class="btn btn-accent ms-lg-3 shadow-sm" to="/register">
            Создать сад
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
