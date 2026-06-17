<template>
  <AppNav v-if="showNav" />
  <RouterView />
  <ToastContainer />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNav from '@/components/AppNav.vue'
import ToastContainer from '@/components/ToastContainer.vue'

const route = useRoute()
const showNav = computed(() =>
  !['login', 'register'].some(name => route.path.includes(name))
)
</script>
