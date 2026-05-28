<script setup>
import { useTheme } from '../composables/useTheme'

const { theme, setTheme } = useTheme()
const themes = [
  { value: 'light', icon: 'theme-light', label: 'Светлая тема' },
  { value: 'dark', icon: 'theme-dark', label: 'Тёмная тема' },
  { value: 'violet', icon: 'theme-violet', label: 'Фиолетовая тема' }
]
</script>

<template>
  <div class="theme-switcher" aria-label="Переключатель темы">
    <button
      v-for="item in themes"
      :key="item.value"
      :class="{ active: theme === item.value }"
      type="button"
      :aria-label="item.label"
      @click="setTheme(item.value)"
    >
      <svg aria-hidden="true">
        <use :href="`/sprite.svg#${item.icon}`" />
      </svg>
    </button>
  </div>
</template>
