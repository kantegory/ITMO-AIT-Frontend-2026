<template>
  <p class="state-message">{{ text }}</p>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'Загрузка...'
  }
});
</script>
