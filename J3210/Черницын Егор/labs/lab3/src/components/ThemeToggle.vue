<script setup>
import { spriteHref } from '@/composables/useSprite'
import { useTheme } from '@/composables/useTheme'

const { toggleTheme } = useTheme()
</script>

<template>
  <button
    id="themeToggle"
    class="theme-switch"
    aria-label="Переключить тему"
    title="Переключить тему"
    type="button"
    @click="toggleTheme"
  >
    <span class="theme-switch__thumb"></span>

    <span class="theme-switch__icon theme-switch__icon--sun">
      <svg><use :href="spriteHref('icon-sun')"></use></svg>
    </span>

    <span class="theme-switch__icon theme-switch__icon--moon">
      <svg><use :href="spriteHref('icon-moon')"></use></svg>
    </span>
  </button>
</template>
