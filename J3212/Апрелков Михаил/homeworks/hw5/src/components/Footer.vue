<script setup>
defineProps({
  text: {
    type: String,
    default: 'Дз 5',
  },
})
</script>

<template>
  <footer class="footer">
    <p>{{ text }}</p>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  padding: 1rem;
  text-align: center;
  font-size: 0.85rem;
  color: #64748b;
  border-top: 1px solid #e0e0e0;
  background: #f8fafc;
}

.footer p {
  margin: 0;
}
</style>
