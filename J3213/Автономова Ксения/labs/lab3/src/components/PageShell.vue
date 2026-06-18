<template>
  <a href="#maincontent" class="skip-link">Перейти к основному содержимому</a>
  <div class="ticket-platform">
    <AppHeader v-if="header" />
    <main id="maincontent" :class="mainClass" role="main">
      <slot />
    </main>
  </div>
</template>
<script setup>
import AppHeader from './AppHeader.vue'
defineProps({
  header: {
    type: Boolean,
    default: true
  },
  mainClass: {
    type: String,
    default: 'container mt-4 flex-grow-1'
  }
})
</script>
