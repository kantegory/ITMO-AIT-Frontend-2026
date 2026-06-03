<script setup>
import { useTheme } from '../composables/useTheme'

const { toggleTheme } = useTheme()
</script>

<template>
  <button class="theme-toggle" aria-label="Toggle theme" @click="toggleTheme">
    <svg class="svg-icon"><use href="/icons.svg#icon-brightness"></use></svg>
  </button>
</template>
