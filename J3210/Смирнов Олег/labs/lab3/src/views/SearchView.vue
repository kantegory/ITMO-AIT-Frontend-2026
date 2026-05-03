<script setup>
defineProps({
  type: { type: String, required: true }, // 'models' | 'datasets'
});
</script>

<template>
  <main id="main-content" class="container py-5">
    <h1>{{ type === 'models' ? 'Модели' : 'Датасеты' }}</h1>
    <p class="text-muted">TODO</p>
  </main>
</template>
