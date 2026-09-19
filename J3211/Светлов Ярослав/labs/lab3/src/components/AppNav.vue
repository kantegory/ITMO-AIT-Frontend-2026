<template>
  <header class="border-bottom"><div class="container py-3 d-flex flex-wrap align-items-center gap-3">
    <RouterLink class="fw-bold text-body text-decoration-none" to="/dashboard">Nexus ML</RouterLink>
    <nav v-if="user" class="d-flex flex-wrap align-items-center gap-3" aria-label="Основная навигация">
      <RouterLink to="/dashboard"><SvgIcon name="user" /> Личный кабинет</RouterLink>
      <RouterLink to="/search"><SvgIcon name="search" /> Эксперименты</RouterLink>
      <RouterLink to="/models"><SvgIcon name="model" /> Модели</RouterLink>
      <button class="btn btn-sm btn-outline-secondary" @click="exit"><SvgIcon name="logout" /> Выйти</button>
    </nav>
  </div></header>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import SvgIcon from './SvgIcon.vue';
const { user, logout } = useAuth();
const router = useRouter();
function exit() { logout(); router.replace('/login'); }
</script>
