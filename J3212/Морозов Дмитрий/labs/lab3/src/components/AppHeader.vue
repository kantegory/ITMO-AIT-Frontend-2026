<script setup>
import { RouterLink } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useTheme } from '../composables/useTheme';

const { isAuthenticated, logout } = useAuth();
const { toggleTheme } = useTheme();
</script>

<template>
  <header class="navbar navbar-expand-lg navbar-dark bg-dark" role="banner">
    <div class="container-fluid px-4">
      <RouterLink class="navbar-brand" :to="isAuthenticated ? '/dashboard' : '/'">
        ML Pipeline
      </RouterLink>

      <div class="d-flex align-items-center gap-2 ms-auto">
        <button
          id="theme-toggle"
          class="btn btn-outline-light btn-sm icon-button-text"
          type="button"
          aria-label="Переключить тему"
          title="Переключить светлую/тёмную тему"
          @click="toggleTheme"
        >
          <svg class="nav-icon" aria-hidden="true">
            <use href="#icon-theme"></use>
          </svg>
          Тема
        </button>

        <button
          v-if="isAuthenticated"
          class="btn btn-outline-light btn-sm icon-button-text"
          type="button"
          @click="logout"
        >
          Выйти
          <svg class="nav-icon nav-icon-end" aria-hidden="true">
            <use href="#icon-logout"></use>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
