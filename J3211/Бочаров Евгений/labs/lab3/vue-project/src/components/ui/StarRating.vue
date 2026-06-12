<template>
  <div class="d-inline-block">
    <span v-for="i in 5" :key="i" @click="$emit('update:modelValue', i)" class="cursor-pointer fs-4" :style="{ color: i <= modelValue ? '#ffc107' : '#ccc' }">★</span>
  </div>
</template>

<script setup>
defineProps({ modelValue: Number })
defineEmits(['update:modelValue'])
</script>