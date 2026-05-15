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

<script>
export default {
  name: 'AppTopbar',
  props: {
    title: { type: String, required: true }
  },
  data() {
    return {
      isDark: true
    }
  },
  mounted() {
    const saved = localStorage.getItem('mlpipe_theme')
    const prefersDark = !window.matchMedia('(prefers-color-scheme: light)').matches
    this.isDark = saved ? saved === 'dark' : prefersDark
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light')
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark
      const theme = this.isDark ? 'dark' : 'light'
      localStorage.setItem('mlpipe_theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    }
  }
}
</script>
