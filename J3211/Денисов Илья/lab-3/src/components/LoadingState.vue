<script setup>
defineProps({
  text: {
    type: String,
    default: 'Загрузка...'
  }
});
</script>

<template>
  <div class="alert alert-secondary w-100" role="status">
    {{ text }}
  </div>
</template>
