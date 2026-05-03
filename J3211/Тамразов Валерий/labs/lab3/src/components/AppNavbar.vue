<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useTheme } from '../composables/useTheme';

const router = useRouter();
const { user, isLoggedIn, logout } = useAuth();
const { theme, toggle } = useTheme();

const onLogout = () => {
  logout();
  router.push({ name: 'login' });
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">
        <i class="bi bi-gear-wide-connected me-1"></i> MLOps Deploy
      </RouterLink>
      <button class="theme-toggle me-2" type="button" :aria-label="theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'" @click="toggle">
        <i :class="theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill'" aria-hidden="true"></i>
      </button>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/pipelines" active-class="active">Пайплайны</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/environments" active-class="active">Среды</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/profile" active-class="active">Кабинет</RouterLink>
          </li>
        </ul>
        <div class="d-flex gap-2 align-items-center">
          <template v-if="isLoggedIn">
            <span class="navbar-text me-2" style="color: var(--text-secondary);">{{ user?.email }}</span>
            <button class="btn btn-outline-danger btn-sm" @click="onLogout">Выйти</button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="btn btn-outline-light btn-sm">Войти</RouterLink>
            <RouterLink to="/register" class="btn btn-primary btn-sm">Регистрация</RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
