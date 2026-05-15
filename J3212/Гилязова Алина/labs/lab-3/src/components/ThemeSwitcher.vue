<template>
  
  <div class="theme-switcher" role="group" aria-label="Переключатель темы сайта">
    <label class="visually-hidden" for="themeSelect">Выберите тему сайта</label>
    <div class="theme-switcher-group">
      <base-icon :name="iconName" />
      <select
        id="themeSelect"
        class="form-select form-select-sm"
        :value="preference"
        @change="setTheme($event.target.value)"
      >
        <option value="system">Системная тема</option>
        <option value="light">Светлая тема</option>
        <option value="dark">Тёмная тема</option>
      </select>
    </div>
  </div>
</template>

<script>

import useTheme from '@/composables/useTheme'
import BaseIcon from '@/components/BaseIcon.vue'

export default {
  name: 'ThemeSwitcher',
  components: { BaseIcon },
  setup() {
    const { preference, resolvedTheme, setTheme } = useTheme()
    return { preference, resolvedTheme, setTheme }
  },
  computed: {

    iconName() {
      return this.resolvedTheme === 'dark' ? 'moon' : 'sun'
    }
  }
}

</script>
