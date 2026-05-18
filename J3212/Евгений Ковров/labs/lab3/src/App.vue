<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <div :class="containerClass">
        <RouterView />
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';

const route = useRoute();

const containerClass = computed(() => {
  return route.name === 'organizer'
    ? 'container container--wide'
    : 'container';
});
</script>
