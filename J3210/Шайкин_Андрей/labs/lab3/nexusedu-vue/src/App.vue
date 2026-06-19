<template>
  <div class="bg-blob-1"></div>
  <div class="bg-blob-2"></div>
  
  <TheNavbar />
  
  <router-view />
</template>

<script setup>
import TheNavbar from '@/components/TheNavbar.vue'
import { useTheme } from '@/composables/useTheme'

useTheme()
</script>