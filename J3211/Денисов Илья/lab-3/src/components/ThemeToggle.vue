<script setup>
import { useTheme } from '../composables/useTheme';

const props = defineProps({
  floating: {
    type: Boolean,
    default: false
  }
});

const { themeLabel, toggleTheme } = useTheme();
</script>

<template>
  <button
    class="btn btn-outline-secondary"
    :class="props.floating ? 'theme-floating-btn' : 'theme-toggle-btn'"
    type="button"
    :aria-label="themeLabel"
    :title="themeLabel"
    @click="toggleTheme"
  >
    {{ themeLabel }}
  </button>
</template>
