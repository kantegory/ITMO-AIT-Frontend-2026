<template>
  <div>
    <BaseNavbar />
    <RouterView />
    <ToastMessage />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import BaseNavbar from '@/components/layout/BaseNavbar.vue'
import ToastMessage from '@/components/ui/ToastMessage.vue'
</script>
