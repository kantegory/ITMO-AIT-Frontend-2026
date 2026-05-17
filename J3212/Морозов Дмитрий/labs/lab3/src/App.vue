<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import IconSprite from './components/IconSprite.vue';
import SidebarNav from './components/SidebarNav.vue';
import { useAuth } from './composables/useAuth';
import { useTheme } from './composables/useTheme';

const { isAuthenticated } = useAuth();
useTheme();
</script>

<template>
  <IconSprite />
  <a href="#main-content" class="skip-link">Перейти к основному содержимому</a>
  <AppHeader />

  <div class="app-shell">
    <SidebarNav v-if="isAuthenticated" />
    <main
      id="main-content"
      class="py-4"
      :class="isAuthenticated ? 'workspace-content px-md-4' : 'auth-content container'"
      role="main"
    >
      <RouterView />
    </main>
  </div>

  <footer class="footer mt-auto py-3" role="contentinfo">
    <div class="container text-center text-muted">
      <p class="mb-0">&copy; 2026 ML Pipeline. Все права защищены.</p>
    </div>
  </footer>
</template>
