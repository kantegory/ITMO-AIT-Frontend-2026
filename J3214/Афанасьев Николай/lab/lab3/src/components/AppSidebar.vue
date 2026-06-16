<script setup>
import { inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const route  = useRoute()
const { session, isTeacher, clearSession, getInitials } = useAuth()

const theme       = inject('theme')
const toggleTheme = inject('toggleTheme')

function logout() {
  clearSession()
  router.push({ name: 'login' })
}

function isActive(name) {
  return route.name === name
}
</script>

<template>
  <div class="sidebar">
    <!-- Логотип + кнопка темы -->
    <div class="sidebar-logo">
      <div class="logo-mark">
        <svg width="36" height="36" viewBox="0 0 56 56">
          <defs>
            <linearGradient id="g-logo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#7F77DD"/>
              <stop offset="100%" stop-color="#3C3489"/>
            </linearGradient>
          </defs>
          <rect width="56" height="56" rx="14" fill="url(#g-logo)"/>
          <text x="9" y="38" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="white" letter-spacing="1">LF</text>
        </svg>
        <span class="logo-text">LearnFlow</span>
      </div>

      <button class="theme-btn" :title="theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'" @click="toggleTheme">
        {{ theme === 'dark' ? '☀️' : '🌙' }}
      </button>
    </div>

    <!-- Навигация для студента -->
    <template v-if="!isTeacher">
      <div class="nav-section">Главное</div>

      <router-link class="nav-item" :class="{ active: isActive('dashboard') }" to="/dashboard">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        Дашборд
      </router-link>

      <router-link class="nav-item" :class="{ active: isActive('courses') || isActive('course') }" to="/courses">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        Каталог курсов
      </router-link>

      <div class="nav-section">Аккаунт</div>

      <router-link class="nav-item" :class="{ active: isActive('settings') }" to="/settings">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        Настройки
      </router-link>
    </template>

    <!-- Навигация для преподавателя -->
    <template v-else>
      <div class="nav-section">Преподаватель</div>

      <router-link class="nav-item" :class="{ active: isActive('teacher') }" to="/teacher">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        Мои курсы
      </router-link>

      <div class="nav-section">Аккаунт</div>

      <router-link class="nav-item" :class="{ active: isActive('dashboard') }" to="/dashboard">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        Кабинет студента
      </router-link>

      <router-link class="nav-item" :class="{ active: isActive('settings') }" to="/settings">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        Настройки
      </router-link>
    </template>

    <!-- Пользователь + выход -->
    <div class="sidebar-footer">
      <div class="user-row">
        <div class="avatar-sm">{{ getInitials() }}</div>
        <div class="user-info">
          <div class="user-name">{{ session?.firstName }} {{ session?.lastName }}</div>
          <div class="user-role">{{ session?.role === 'teacher' ? 'Преподаватель' : 'Студент' }}</div>
        </div>
      </div>

      <button class="nav-item logout-btn" @click="logout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Выйти
      </button>
    </div>
  </div>
</template>

<style scoped>
.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.logo-mark {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.theme-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 10px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 15px;
  flex-shrink: 0;
  transition: background 0.15s, box-shadow 0.15s;
}
.theme-btn:hover { box-shadow: var(--shadow-sm); background: var(--primary-subtle); }

.sidebar-footer {
  margin-top: auto;
  border-top: 1px solid var(--border);
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
}

.avatar-sm {
  width: 34px;
  height: 34px;
  background: var(--primary);
  color: #fff;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}

.user-info {
  min-width: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 11px;
  color: var(--muted);
}

.logout-btn {
  color: var(--danger) !important;
}
.logout-btn:hover {
  background: rgba(226, 75, 74, 0.08) !important;
  color: var(--danger) !important;
}
</style>
