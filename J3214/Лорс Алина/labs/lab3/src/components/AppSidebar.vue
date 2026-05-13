<template>
  <aside class="app-sidebar d-none d-lg-flex" aria-label="Основная навигация">
    <div class="sidebar-brand">
      <IconSprite name="wallet2" />
      <span>Tarelka</span>
    </div>

    <nav class="sidebar-nav" aria-label="Разделы приложения">
      <RouterLink v-for="item in menu" :key="item.to" :to="item.to" class="sidebar-link">
        <IconSprite :name="item.icon" />
        <span>{{ item.title }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar-user mt-auto">
      <div class="small text-secondary">Пользователь</div>
      <strong>{{ currentUser?.firstName || 'Аккаунт' }}</strong>
      <button class="btn btn-outline-secondary btn-sm mt-3 w-100" type="button" @click="handleLogout">Выйти</button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import IconSprite from './IconSprite.vue';

const router = useRouter();
const { currentUser, logout } = useAuth();

const menu = [
  { to: '/dashboard', title: 'Кабинет', icon: 'grid-1x2-fill' },
  { to: '/transactions', title: 'Транзакции', icon: 'receipt-cutoff' },
  { to: '/reports', title: 'Отчёты', icon: 'bar-chart-line-fill' },
  { to: '/integrations', title: 'Интеграции', icon: 'plug' }
];

function handleLogout() {
  logout();
  router.push('/login');
}
</script>
