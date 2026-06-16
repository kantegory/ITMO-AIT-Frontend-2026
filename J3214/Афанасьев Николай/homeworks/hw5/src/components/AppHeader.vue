<script setup>
import { inject } from 'vue'

const theme = inject('theme')
const toggleTheme = inject('toggleTheme')
</script>

<template>
  <header class="header">
    <div class="logo">
      <svg width="32" height="32" viewBox="0 0 56 56" aria-hidden="true">
        <defs>
          <linearGradient id="hdr-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#7F77DD"/>
            <stop offset="100%" stop-color="#3C3489"/>
          </linearGradient>
        </defs>
        <rect width="56" height="56" rx="14" fill="url(#hdr-grad)"/>
        <text x="9" y="38" font-family="Arial,sans-serif" font-size="24"
              font-weight="700" fill="white" letter-spacing="1">LF</text>
      </svg>
      <span class="logo-text">LearnFlow</span>
    </div>

    <nav class="nav">
      <a class="nav-link active" href="#">Каталог</a>
      <a class="nav-link" href="#">Мои курсы</a>
      <a class="nav-link" href="#">Прогресс</a>
    </nav>

    <button class="theme-btn" @click="toggleTheme" :title="theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'">
      {{ theme === 'dark' ? '☀️' : '🌙' }}
    </button>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.9rem 1.5rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
  transition: background 0.25s, border-color 0.25s;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: auto;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.nav {
  display: flex;
  gap: 0.25rem;
}

.nav-link {
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 14px;
  color: var(--muted);
  transition: background 0.15s, color 0.15s;
}

.nav-link:hover,
.nav-link.active {
  background: var(--primary-subtle);
  color: var(--primary);
  font-weight: 600;
}

.theme-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 10px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.15s, box-shadow 0.15s;
}

.theme-btn:hover {
  box-shadow: var(--shadow-sm);
}
</style>
