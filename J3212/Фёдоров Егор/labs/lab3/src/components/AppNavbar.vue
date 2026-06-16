<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, isLoggedIn, logout } = useAuth()

function handleLogout() {
  logout()
  router.push({ name: 'search' })
}
</script>

<template>
  <nav class="navbar navbar-expand-md bg-white sticky-top">
    <div class="container">
      <RouterLink :to="{ name: 'search' }" class="navbar-brand brand">ModelHub</RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMenu"
        aria-label="Открыть меню"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="navMenu" class="collapse navbar-collapse show">
        <div class="ms-auto d-flex align-items-center gap-3 flex-wrap">
          <RouterLink :to="{ name: 'search' }" class="nav-link fw-semibold">Поиск</RouterLink>

          <template v-if="isLoggedIn">
            <span class="nav-link">Здравствуйте, {{ user?.name || user?.username }}</span>
            <RouterLink :to="{ name: 'profile' }" class="btn btn-primary rounded-3">Профиль</RouterLink>
            <button class="btn btn-outline-secondary rounded-3" type="button" @click="handleLogout">
              Выйти
            </button>
          </template>

          <template v-else>
            <RouterLink :to="{ name: 'login' }" class="nav-link fw-semibold">Вход</RouterLink>
            <RouterLink :to="{ name: 'register' }" class="btn btn-primary rounded-3">Регистрация</RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
