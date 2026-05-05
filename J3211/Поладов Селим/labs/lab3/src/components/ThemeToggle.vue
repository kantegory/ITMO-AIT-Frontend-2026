<template>
  <button
    type="button"
    :class="fixed ? 'theme-toggle-fixed' : 'theme-toggle'"
    aria-label="Переключить тему"
    @click="toggle"
  >
    <Icon v-if="theme === 'light'" name="moon" :size="18" />
    <Icon v-else name="sun" :size="18" />
  </button>
</template>

<script setup>
import Icon from './Icon.vue'
import { useTheme } from '../composables/useTheme.js'

defineProps({ fixed: { type: Boolean, default: false } })

const { theme, toggle } = useTheme()
</script>
