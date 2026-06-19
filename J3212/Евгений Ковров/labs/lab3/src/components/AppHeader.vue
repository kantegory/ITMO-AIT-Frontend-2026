<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink class="brand" to="/">
        <span class="brand__badge">КМ</span>
        <span>Контрамарка</span>
      </RouterLink>

      <nav class="app-nav" aria-label="Основная навигация">
        <RouterLink to="/">События</RouterLink>
        <RouterLink to="/organizer">Организатору</RouterLink>
        <button class="app-nav__button app-nav__button--icon" type="button" :title="`Переключить на ${nextThemeLabel} тему`" @click="toggleTheme">
          <SvgIcon name="icon-moon" />
          <span>{{ theme === 'classic' ? 'Classic' : 'Neon' }}</span>
        </button>
        <template v-if="isAuthenticated">
          <RouterLink to="/orders">Мои билеты</RouterLink>
          <RouterLink to="/profile">Профиль</RouterLink>
          <span class="app-nav__user">
            <SvgIcon name="icon-user" />
            <span>{{ displayName }}</span>
          </span>
          <button class="app-nav__button" type="button" @click="handleLogout">Выйти</button>
        </template>
        <template v-else>
          <RouterLink to="/login">Войти</RouterLink>
          <RouterLink class="app-nav__accent" to="/register">Регистрация</RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useTheme } from '../composables/useTheme';
import SvgIcon from './SvgIcon.vue';

const router = useRouter();
const { currentUser, isAuthenticated, logout } = useAuth();
const { theme, nextThemeLabel, toggleTheme } = useTheme();

const displayName = computed(() => currentUser.value?.name || currentUser.value?.email || 'Пользователь');

function handleLogout() {
  logout();
  router.push('/');
}
</script>
