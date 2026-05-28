<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const query  = ref('')
const { isAuth, userAvatar } = useAuth()

const submitSearch = () => {
  router.push({ path: '/search', query: { q: query.value } })
}
</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="brand" aria-label="ModelHub">
      <span>ModelHub</span>
    </RouterLink>

    <form class="top-search" role="search" @submit.prevent="submitSearch">
      <svg
          class="top-search-icon"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
      >
        <use href="/sprite.svg#icon-search" />
      </svg>

      <input
          v-model="query"
          type="search"
          placeholder="Поиск моделей и датасетов"
      />
    </form>

    <nav class="top-nav" aria-label="Главное меню">
      <RouterLink v-if="isAuth" to="/profile" class="header-avatar-link" aria-label="Профиль">
        <img
          :src="userAvatar || 'https://i.pravatar.cc/80?img=10'"
          alt="Профиль"
          class="header-avatar"
        />
      </RouterLink>

      <RouterLink v-else to="/login" class="login-link">Войти</RouterLink>
    </nav>
  </header>
</template>
