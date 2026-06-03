<template>
  <header class="topbar">
    <div class="topbar-search">
      <label for="topbarSearch" class="visually-hidden">Поиск</label>
      <input type="text" id="topbarSearch" class="form-control search-input"
             :placeholder="searchPlaceholder" />
    </div>
    <div class="topbar-actions">
      <!-- Переключатель темы -->
      <button class="theme-toggle-btn" @click="toggleTheme" :title="isDark ? 'Светлая тема' : 'Тёмная тема'">
        <span v-if="isDark">☀️</span>
        <span v-else>🌙</span>
      </button>
    </div>
    <div class="topbar-user">
      <div class="user-meta">
        <div class="user-name">{{ userName }}</div>
        <div class="user-role">{{ roleLabel }}</div>
      </div>
      <div class="user-avatar" role="button" tabindex="0" @click="handleLogout">
        {{ avatarLetter }}
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
// Используем composables вместо stores
import { useAuth, useTheme } from '@/composables'

defineProps({
  searchPlaceholder: { type: String, default: 'Поиск...' },
  roleLabel: { type: String, default: 'Пользователь' }
})

const { userName, logout } = useAuth()
const { toggle, isDark } = useTheme()
const router = useRouter()

const avatarLetter = computed(() => {
  return (userName.value || 'P').charAt(0).toUpperCase()
})

function handleLogout() {
  logout('/')
}

function toggleTheme() {
  toggle()
}
</script>

<style scoped>
.theme-toggle-btn {
  background: var(--bg-secondary, #f0f0f0);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  margin-right: 12px;
}

.theme-toggle-btn:hover {
  background: var(--bg-tertiary, #e0e0e0);
  transform: scale(1.1);
}

.topbar-actions {
  display: flex;
  align-items: center;
}
</style>