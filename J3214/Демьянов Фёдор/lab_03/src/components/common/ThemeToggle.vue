<template>
  <button
    type="button"
    class="theme-toggle-btn shadow-none"
    :aria-label="buttonLabel"
    :title="buttonLabel"
    @click="toggleTheme"
  >
    <svg :class="['icon', isLight ? 'text-warning' : 'text-main']" aria-hidden="true" focusable="false">
      <use :href="`/assets/images/sprite.svg${isLight ? '#icon-sun' : '#icon-moon'}`"></use>
    </svg>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../../composables/useTheme'

const { currentTheme, toggleTheme } = useTheme()

const isLight = computed(() => currentTheme.value === 'light')
const buttonLabel = computed(() =>
  isLight.value ? 'Активировать режим Eclipse (тёмный)' : 'Активировать режим Nova (светлый)'
)
</script>