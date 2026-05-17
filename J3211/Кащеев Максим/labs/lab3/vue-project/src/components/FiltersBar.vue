<template>
  <div class="filters-bar">
    <button
      v-for="cat in categories"
      :key="cat.value"
      class="pill-filter"
      :class="{ active: modelValue === cat.value }"
      @click="$emit('update:modelValue', cat.value)"
    >
      {{ cat.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, required: true },
  modelValue: { type: String, default: '' }
})

defineEmits(['update:modelValue'])
</script>
