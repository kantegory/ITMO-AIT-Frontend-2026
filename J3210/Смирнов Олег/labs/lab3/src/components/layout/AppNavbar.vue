<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useTheme } from '@/composables/useTheme';
import SvgIcon from '@/components/ui/SvgIcon.vue';
import Avatar from '@/components/ui/Avatar.vue';

const router = useRouter();
const { user, isAuthenticated, logout } = useAuth();
const { isDark, toggle } = useTheme();

function handleLogout() {
  logout();
  router.push('/');
}
</script>

<template>
  <nav class="navbar navbar-expand-lg sticky-top" aria-label="Основная навигация">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">
        <SvgIcon name="cpu" /> AI Hub
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-expanded="false"
        aria-label="Открыть меню навигации"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/" active-class="active" exact-active-class="active">
              Главная
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/models" active-class="active">Модели</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/datasets" active-class="active">Датасеты</RouterLink>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-2">
          <button
            class="btn btn-outline-themed btn-sm"
            type="button"
            :title="isDark ? 'Светлая тема' : 'Тёмная тема'"
            @click="toggle"
          >
            <SvgIcon :name="isDark ? 'sun' : 'moon-stars'" />
          </button>

          <template v-if="isAuthenticated">
            <RouterLink to="/dashboard" class="d-flex align-items-center gap-2 text-decoration-none">
              <Avatar :name="user.name" />
              <span class="small d-none d-md-inline" style="color: var(--text);">{{ user.name }}</span>
            </RouterLink>
            <button class="btn btn-outline-themed btn-sm" type="button" @click="handleLogout">
              Выйти
            </button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="btn btn-outline-themed btn-sm">Войти</RouterLink>
            <RouterLink to="/register" class="btn btn-accent btn-sm">Регистрация</RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
