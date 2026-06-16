<script setup>
import { ref, provide, watch } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light')

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

provide('theme', theme)
provide('toggleTheme', toggleTheme)

watch(theme, val => {
  document.documentElement.setAttribute('data-theme', val)
}, { immediate: true })
</script>

<template>
  <RouterView />
</template>
