<script setup>
import { watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { session } from './composables/useSession.js';
import PageLayout from './components/PageLayout.vue';

const route = useRoute();
const router = useRouter();
watch(session, (value) => {
  if (!value && route.meta.requiresAuth) {
    router.replace({ path: '/login', query: { returnTo: route.fullPath } });
  }
});

async function focusPage() {
  await nextTick();
  document.querySelector('main h1')?.focus({ preventScroll: true });
}
</script>
<template>
  <PageLayout
    ><RouterView v-slot="{ Component }"
      ><component :is="Component" :key="route.path" @vue:mounted="focusPage" /></RouterView
  ></PageLayout>
</template>
