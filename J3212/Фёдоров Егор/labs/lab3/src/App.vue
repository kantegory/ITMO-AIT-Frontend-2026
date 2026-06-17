<script setup>
import { onMounted } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'
import { useAuth } from '@/composables/useAuth'

const { syncMe } = useAuth()

onMounted(() => {
  syncMe()
})
</script>

<template>
  <AppNavbar />
  <RouterView />
</template>
