<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import { useAuth } from './composables/useAuth';
import { useCourses } from './composables/useCourses';

const { isAuthenticated } = useAuth();
const { fetchCourses, fetchEnrollments } = useCourses();

onMounted(async () => {
  await fetchCourses();
  if (isAuthenticated.value) {
    await fetchEnrollments();
  }
});
</script>

<template>
  <a class="skip-link" href="#main">Перейти к содержимому</a>
  <AppHeader />

  <main id="main" class="page-shell">
    <RouterView />
  </main>
</template>
