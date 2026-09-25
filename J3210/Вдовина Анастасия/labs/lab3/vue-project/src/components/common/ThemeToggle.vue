<template>
  <button type="button" class="btn btn-outline-secondary" :aria-pressed="theme === 'dark'" @click="toggleTheme">
    <icon-component :name="theme === 'dark' ? 'moon' : 'sun'" />
    {{ theme === 'dark' ? 'Светлая тема' : 'Тёмная тема' }}
  </button>
</template>

<script>
import IconComponent from '@/components/common/IconComponent.vue'
import { useTheme } from '@/composables/useTheme'

export default {
  name: 'ThemeToggle',
  components: { IconComponent },

  setup() {
    return useTheme()
  },
}
</script>
