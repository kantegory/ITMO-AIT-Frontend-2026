<template>
  <a class="skip-link" href="#main" @click.prevent="main.focus()">Перейти к содержимому</a>
  <AppNav />
  <main id="main" ref="main" class="container py-4" tabindex="-1">
    <RouterView :key="route.fullPath" />
  </main>
</template>
<script setup>
import { ref, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import AppNav from './components/AppNav.vue';
const main = ref(null);
const route = useRoute();
watch(() => route.fullPath, async () => {
  await nextTick();
  const heading = main.value?.querySelector('h1');
  if (heading) { heading.focus(); document.title = heading.textContent + ' — Nexus ML'; }
});
</script>
