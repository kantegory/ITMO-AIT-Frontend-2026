<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['confirm'])
</script>

<template>
  <div class="text-center">
    <button type="button" class="btn btn-primary btn-lg" :disabled="disabled" @click="$emit('confirm')">
      Подтвердить
    </button>
  </div>
</template>
