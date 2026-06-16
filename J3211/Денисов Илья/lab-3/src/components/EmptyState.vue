<script setup>
defineProps({
  text: {
    type: String,
    default: 'Данные не найдены.'
  }
});
</script>

<template>
  <div class="alert alert-secondary w-100" role="status">
    {{ text }}
  </div>
</template>
