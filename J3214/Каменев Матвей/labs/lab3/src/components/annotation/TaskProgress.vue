<script setup>
defineProps({
  current: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <p class="text-muted text-center mb-3" role="status" :aria-label="`Прогресс: ${current} из ${total}`">
    {{ current }} / {{ total }}
  </p>
</template>
