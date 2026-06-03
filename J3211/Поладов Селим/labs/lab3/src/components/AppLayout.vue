<template>
  <AppSidebar />
  <main class="main-wrap">
    <AppHeader :title="title" />
    <slot />
  </main>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

defineProps({ title: { type: String, required: true } })
</script>
