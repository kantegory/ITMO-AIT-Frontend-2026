<template>
  <nav class="app-nav" aria-label="Основная навигация">
    <RouterLink to="/dashboard" class="nav-brand" aria-label="Wanderlust — перейти на главную">
      Wanderlust
    </RouterLink>

    <div class="nav-links ms-auto me-3">
      <RouterLink to="/dashboard" class="nav-link" active-class="active">Кабинет</RouterLink>
      <RouterLink to="/search"    class="nav-link" active-class="active">Поиск</RouterLink>
      <RouterLink to="/collab"    class="nav-link" active-class="active">Совместно</RouterLink>
    </div>

    <RouterLink to="/search" class="btn-outline-custom d-none d-md-inline-flex me-3"
      style="padding:.4rem 1rem;font-size:.82rem;">
      Исследовать
    </RouterLink>

    <button class="theme-toggle me-2" @click="toggleTheme"
      :aria-label="isDark ? 'Включить светлую тему' : 'Включить тёмную тему'">
      {{ isDark ? '☀️' : '🌙' }}
    </button>

    <!-- Аватар пользователя -->
    <div class="dropdown">
      <button class="nav-avatar" data-bs-toggle="dropdown" aria-expanded="false"
        :aria-label="`Меню пользователя: ${fullName}`">
        {{ initials }}
      </button>
      <ul class="dropdown-menu dropdown-menu-end dropdown-menu-light" role="menu">
        <li role="none">
          <RouterLink class="dropdown-item" to="/dashboard" role="menuitem">
            <i class="bi bi-person me-2"></i>Профиль
          </RouterLink>
        </li>
        <li role="none"><hr class="dropdown-divider"/></li>
        <li role="none">
          <a class="dropdown-item" href="#" role="menuitem"
            style="color:#dc2626;" @click.prevent="handleLogout">
            <i class="bi bi-box-arrow-right me-2"></i>Выйти
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const { getFullName, getInitials, clearSession } = useAuth()
const { isDark, toggleTheme } = useTheme()

const fullName = computed(() => getFullName())
const initials = computed(() => getInitials())

function handleLogout() {
  clearSession()
  router.replace('/login')
}
</script>
