<script setup>
import { useTheme } from '../composables/useTheme'

const { toggleTheme } = useTheme()
</script>

<template>
  <button class="btn btn-sm btn-outline-light" type="button" @click="toggleTheme" aria-label="Переключить тему">
    <svg class="icon-inline" aria-hidden="true">
      <use href="/icons/sprite.svg#icon-theme"></use>
    </svg>
    <span>Тема</span>
  </button>
</template>
