<script setup lang="ts">
import { useRouter } from 'vue-router';
import SvgIcon from './SvgIcon.vue';
import ThemeToggle from './ThemeToggle.vue';
import { useAuth } from '../composables/useAuth';

defineProps<{ title?: string }>();

const { logout } = useAuth();
const router = useRouter();

function onLogout(): void {
  logout();
  void router.replace({ name: 'login' });
}
</script>

<template>
  <header class="topbar">
    <slot name="left">
      <span class="topbar-title">{{ title }}</span>
    </slot>
    <div class="topbar-right">
      <ThemeToggle />
      <button type="button" class="icon-btn" title="Уведомления" aria-label="Уведомления">
        <SvgIcon name="bell" />
        <span class="notif-dot" />
      </button>
      <button type="button" class="icon-btn" title="Настройки" aria-label="Настройки">
        <SvgIcon name="cog" />
      </button>
      <button type="button" class="icon-btn" title="Выйти" aria-label="Выйти" @click="onLogout">
        <SvgIcon name="logout" />
      </button>
    </div>
  </header>
</template>
