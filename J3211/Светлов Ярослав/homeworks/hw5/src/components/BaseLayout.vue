<template>
  <a class="skip-link" href="#main" @click.prevent="focusMain">Перейти к содержимому</a>
  <header class="border-bottom"><nav class="container py-3 d-flex gap-3" aria-label="Основная навигация">
    <RouterLink to="/">Заметки</RouterLink><RouterLink to="/new">Добавить заметку</RouterLink>
  </nav></header>
  <main id="main" ref="main" class="container py-4" tabindex="-1"><slot /></main>
</template>
<script setup>
import { ref, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
const main = ref(null);
const route = useRoute();
function focusMain() { main.value.focus(); }
watch(() => route.path, async () => { await nextTick(); main.value.querySelector('h1')?.focus(); });
</script>
