<template>
  <header class="app-topbar d-flex align-items-center justify-content-between gap-3 px-3 px-lg-4 py-3">
    <div>
      <div class="text-secondary small">{{ subtitle }}</div>
      <strong>{{ title }}</strong>
    </div>
    <div class="d-flex align-items-center gap-2">
      <ThemeToggle />
      <span class="badge text-bg-primary rounded-pill">{{ currentUser?.currency || 'EUR' }}</span>
    </div>
  </header>
</template>

<script setup>
import { useAuth } from '../composables/useAuth';
import ThemeToggle from './ThemeToggle.vue';

defineProps({
  title: {
    type: String,
    default: 'Tarelka'
  },
  subtitle: {
    type: String,
    default: 'Vue SPA'
  }
});

const { currentUser } = useAuth();
</script>
