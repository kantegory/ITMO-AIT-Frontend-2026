<template>
  <nav class="glass-navbar navbar navbar-expand-lg px-3">
    <div class="container-xl">
      <RouterLink class="navbar-brand" to="/">
        <i class="bi bi-cpu me-2"></i>ML Hub
      </RouterLink>

      <button
        class="navbar-toggler border-0"
        type="button"
        @click="menuOpen = !menuOpen"
      >
        <i class="bi bi-list fs-4"></i>
      </button>

      <div :class="['navbar-collapse', { show: menuOpen }]" id="navMenu">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/models">Модели</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/datasets">Датасеты</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/spaces">Пространства</RouterLink>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-2">
          <form class="d-flex" @submit.prevent="handleSearch">
            <input
              v-model="searchQuery"
              class="form-control form-control-sm rounded-pill"
              type="search"
              placeholder="Поиск..."
              style="max-width:220px"
            />
          </form>

          <template v-if="auth.isLoggedIn">
            <RouterLink to="/account" class="btn btn-sm btn-outline-glass">
              <i class="bi bi-person-circle me-1"></i>{{ auth.user?.name?.split(' ')[0] }}
            </RouterLink>
            <button class="btn btn-sm btn-outline-glass" @click="auth.logout(); $router.push('/')">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="btn btn-sm btn-outline-glass">Войти</RouterLink>
            <RouterLink to="/register" class="btn btn-sm btn-primary-glass">Регистрация</RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()
const router = useRouter()
const searchQuery = ref('')
const menuOpen = ref(false)

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'Models', query: { search: searchQuery.value.trim() } })
    searchQuery.value = ''
    menuOpen.value = false
  }
}
</script>
