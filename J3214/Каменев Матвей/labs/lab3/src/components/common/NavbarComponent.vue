<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const items = [
  { to: { name: 'home' }, text: 'Главная' },
  { to: { name: 'profile' }, text: 'Личный кабинет' },
]

async function logout() {
  await router.push({ name: 'home' })
  auth.logout()
}
</script>

<template>
  <nav class="navbar border-bottom" aria-label="Основная навигация">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center gap-2" :to="{ name: 'home' }">
        <img src="/img/logo.png" alt="" height="40" />
        annotaylor
      </router-link>
      <div class="d-flex align-items-center gap-3">
        <ul class="navbar-nav list-group-horizontal gap-4">
          <li v-for="item in items" :key="item.text" class="nav-item">
            <router-link class="nav-link" active-class="active" :to="item.to">
              {{ item.text }}
            </router-link>
          </li>
        </ul>
        <template v-if="auth.isAuthenticated">
          <span class="d-flex align-items-center gap-2">
            <span class="text-muted">{{ auth.user.name || auth.user.email }}</span>
            <button type="button" class="btn btn-outline-danger" @click="logout">Выйти</button>
          </span>
        </template>
        <template v-else>
          <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
            Вход
          </button>
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#registerModal">
            Регистрация
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  height: 80px;
}
</style>
