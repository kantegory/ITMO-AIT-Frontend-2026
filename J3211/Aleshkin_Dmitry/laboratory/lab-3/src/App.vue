<template>
  <div class="app-shell">
    <AppHeader
      :is-authenticated="isAuthenticated"
      :rates="finance.exchangeRates.value"
      :theme-label="theme.label.value"
      :theme-icon="theme.icon.value"
      @logout="handleLogout"
      @toggle-theme="theme.cycleTheme"
    />

    <main class="app-main main-block">
      <div v-if="fatalError" class="container">
        <div class="alert alert-danger">
          <h4 class="mb-2">Ошибка отрисовки страницы</h4>
          <pre class="mb-0">{{ fatalError }}</pre>
        </div>
      </div>

      <RouterView v-else v-slot="{ Component }">
        <component :is="Component" :key="$route.fullPath" />
      </RouterView>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { computed, onErrorCaptured, onMounted, ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';

import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import { useFinanceManager } from './composables/useFinanceManager.js';
import { useTheme } from './composables/useTheme.js';

const router = useRouter();
const finance = useFinanceManager();
const theme = useTheme();

const fatalError = ref('');

const isAuthenticated = computed(() => {
  return !finance.isDemo.value && finance.currentUser.value?.id !== 'demo';
});

onErrorCaptured((error) => {
  console.error('Vue render error:', error);
  fatalError.value = error?.stack || error?.message || String(error);
  return false;
});

onMounted(async () => {
  theme.initTheme();

  try {
    await finance.loadUserData();
  } catch (error) {
    console.error('loadUserData failed:', error);
    fatalError.value = error?.stack || error?.message || String(error);
  }
});

function handleLogout() {
  finance.logout();
  fatalError.value = '';
  router.push({ name: 'dashboard' });
}
</script>