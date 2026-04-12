<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <header class="header">
    <h1 class="header__title">{{ title }}</h1>
    <p v-if="subtitle" class="header__subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
.header {
  padding: 1.25rem 1rem;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  background: #f8fafc;
}

.header__title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.header__subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
}
</style>
