<template>
  <div>
    <BaseNavbar />
    <RouterView />
    <ToastMessage />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import BaseNavbar from '@/components/BaseNavbar.vue'
import ToastMessage from '@/components/ToastMessage.vue'
</script>
