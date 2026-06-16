<template>
  <div v-if="isDemo" class="demo-banner">
    Вы находитесь в демо-режиме. Изменение данных отключено.
  </div>
</template>

<script setup>
defineProps({
  isDemo: Boolean,
});
</script>