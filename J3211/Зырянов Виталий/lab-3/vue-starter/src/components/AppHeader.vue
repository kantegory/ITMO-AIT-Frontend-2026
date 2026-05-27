<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useApi } from '../composables/useApi'
import { useSession } from '../composables/useSession'

const route = useRoute()
const router = useRouter()
const { post } = useApi()
const { isAuthenticated, clearSession } = useSession()

const links = computed(() => {
  if (!isAuthenticated.value) {
    return [
      { name: 'register', label: 'Регистрация' },
      { name: 'login', label: 'Вход' }
    ]
  }

  return [
    { name: 'search', label: 'Поиск' },
    { name: 'profile', label: 'Профиль' },
    { name: 'model', label: 'Модель', params: { id: 1 } }
  ]
})

async function logout() {
  try {
    await post('/logout', {})
  } catch {
    // Игнорируем ошибки сети при выходе и всё равно очищаем локальную сессию.
  } finally {
    clearSession()
    router.push({ name: 'login' })
  }
}

function isCurrent(link) {
  return route.name === link.name
}
</script>

<template>
  <header class="top-nav">
    <nav class="container navbar navbar-expand-lg py-3" aria-label="Основная навигация">
      <RouterLink class="navbar-brand brand" :to="{ name: isAuthenticated ? 'search' : 'login' }">
        <span>AI Model &amp; Dataset Hub</span>
      </RouterLink>

      <ul class="navbar-nav ms-auto flex-row gap-3 align-items-center">
        <li v-for="link in links" :key="link.name" class="nav-item">
          <RouterLink
            class="nav-link"
            :class="{ active: isCurrent(link) }"
            :to="{ name: link.name, params: link.params }"
          >
            {{ link.label }}
          </RouterLink>
        </li>

        <li v-if="isAuthenticated" class="nav-item">
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="logout">Выйти</button>
        </li>
      </ul>
    </nav>
  </header>
</template>
