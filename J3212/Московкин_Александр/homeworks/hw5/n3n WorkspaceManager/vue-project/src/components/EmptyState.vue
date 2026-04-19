<script setup>
defineProps({
  title: {
    type: String,
    default: 'Пока ничего нет'
  },
  text: {
    type: String,
    default: 'Добавьте первый элемент, чтобы начать работу.'
  }
})
</script>

<template>
  <div class="card border-0 shadow-sm empty-state">
    <div class="card-body text-center py-5">
      <h3 class="h5 mb-2">{{ title }}</h3>
      <p class="text-muted mb-0">{{ text }}</p>
    </div>
  </div>
</template>