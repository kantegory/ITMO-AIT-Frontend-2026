<template>
  <nav class="navbar navbar-expand-lg app-navbar sticky-top" aria-label="Основная навигация">
    <div class="container py-2">
      <RouterLink class="navbar-brand fw-bold" to="/dashboard">
        DataForge<span class="brand-dot">.</span>
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="Переключить навигацию"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ms-auto gap-lg-2">
          <template v-if="!session">
            <li class="nav-item">
              <RouterLink class="nav-link" :class="{ active: route.name === 'login' }" to="/login" :aria-current="route.name === 'login' ? 'page' : undefined">
                Вход
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :class="{ active: route.name === 'register' }" to="/register" :aria-current="route.name === 'register' ? 'page' : undefined">
                Регистрация
              </RouterLink>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" :class="{ active: route.name === 'dashboard' }" to="/dashboard" :aria-current="route.name === 'dashboard' ? 'page' : undefined">
                <svg class="nav-icon" aria-hidden="true"><use href="/icons.svg#icon-home"/></svg> Кабинет
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :class="{ active: route.name === 'search' }" to="/search" :aria-current="route.name === 'search' ? 'page' : undefined">
                <svg class="nav-icon" aria-hidden="true"><use href="/icons.svg#icon-search"/></svg> Поиск
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :class="{ active: route.name === 'task' }" to="/task/1" :aria-current="route.name === 'task' ? 'page' : undefined">
                <svg class="nav-icon" aria-hidden="true"><use href="/icons.svg#icon-task"/></svg> Задача
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :class="{ active: route.name === 'workers' }" to="/workers" :aria-current="route.name === 'workers' ? 'page' : undefined">
                <svg class="nav-icon" aria-hidden="true"><use href="/icons.svg#icon-users"/></svg> Рабочие
              </RouterLink>
            </li>
            <li class="nav-item d-flex align-items-center">
              <span class="nav-link disabled">{{ userName }}</span>
            </li>
            <li class="nav-item">
              <button
                type="button"
                class="btn btn-sm btn-outline-brand ms-lg-2 d-flex align-items-center gap-1"
                @click="logout"
              >
                <svg class="nav-icon" aria-hidden="true"><use href="/icons.svg#icon-logout"/></svg>
                Выйти
              </button>
            </li>
          </template>
          <li class="nav-item ms-lg-2">
            <button
              id="theme-toggle"
              type="button"
              class="btn btn-sm btn-outline-brand"
              :aria-label="theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'"
              :aria-pressed="theme === 'dark' ? 'true' : 'false'"
              @click="toggleTheme"
            >
              {{ theme === 'dark' ? '☀ Светлая' : '☾ Тёмная' }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useTheme } from '../composables/useTheme'
import { useApi } from '../composables/useApi'

const route = useRoute()
const router = useRouter()
const { getSession, clearSession } = useAuth()
const { theme, toggleTheme } = useTheme()
const { get } = useApi()

const session = computed(() => getSession())
const userName = ref('')

async function fetchUserName() {
  const s = getSession()
  if (!s) return
  try {
    const user = await get(`/users/${s.userId}`)
    userName.value = `${user.firstName} ${user.lastName}`
  } catch {
    userName.value = ''
  }
}

watch(
  () => getSession(),
  (s) => { if (s) fetchUserName() },
  { immediate: true }
)

watch(
  () => route.name,
  () => {
    if (getSession()) fetchUserName()
  }
)

function logout() {
  clearSession()
  router.push('/login')
}
</script>
