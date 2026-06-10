<script setup>
defineProps({
  text: { type: String, default: 'Нет данных' },
  variant: { type: String, default: 'muted' }
})
</script>

<template>
  <div class="col-12">
    <div
      class="card-custom p-4 text-center"
      :class="variant === 'danger' ? 'text-danger' : 'text-muted'"
    >
      {{ text }}
    </div>
  </div>
</template>
