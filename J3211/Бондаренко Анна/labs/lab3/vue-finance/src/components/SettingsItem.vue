<template>
  <div class="item-row">
    <slot />
    <button class="delete-btn" @click="$emit('delete')">[ X ]</button>
  </div>
</template>

<script setup>
defineEmits(['delete'])
</script>