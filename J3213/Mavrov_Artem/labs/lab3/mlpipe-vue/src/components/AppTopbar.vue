<template>
  <div class="topbar">
    <span class="tb-title">{{ title }}</span>
    <div style="display:flex;align-items:center;gap:.5rem;">
      <slot name="actions" />
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Светлая тема' : 'Тёмная тема'">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  title: { type: String, required: true }
})

const isDark = ref(true)

onMounted(() => {
  const saved = localStorage.getItem('mlpipe_theme')
  const prefersDark = !window.matchMedia('(prefers-color-scheme: light)').matches
  isDark.value = saved ? saved === 'dark' : prefersDark
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
})

function toggleTheme() {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  localStorage.setItem('mlpipe_theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
}
</script>
