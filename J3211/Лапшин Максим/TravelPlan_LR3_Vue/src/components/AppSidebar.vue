<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'
import { useAuth } from '@/composables/useAuth'

const open = ref(false)
const router = useRouter()
const { isLoggedIn, logout } = useAuth()

function close() { open.value = false }
function handleLogout() {
  logout()
  close()
  router.push({ name: 'login' })
}
</script>

<template>
  <button class="btn btn-light mobile-menu-button d-lg-none" aria-label="Открыть меню" @click="open = true">
    <svg class="bi" width="24" height="24"><use href="#menu" /></svg>
  </button>
  <div class="sidebar-overlay" :class="{ show: open }" @click="close"></div>
  <nav class="sidebar p-3 d-flex flex-column" :class="{ show: open }" aria-label="Основное меню">
    <RouterLink class="brand d-flex align-items-center mb-3 text-decoration-none" :to="{ name: 'home' }" @click="close">
      <svg class="bi me-2" width="32" height="32"><use href="#airplane" /></svg>
      <span class="fs-4 fw-bold text-primary">TravelPlan</span>
    </RouterLink>
    <hr class="custom-divider">
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <RouterLink class="nav-link" :to="{ name: 'home' }" @click="close">
          <svg class="bi me-2" width="16" height="16"><use href="#search" /></svg>Поиск туров
        </RouterLink>
      </li>
      <li>
        <RouterLink class="nav-link" :to="{ name: 'dashboard' }" @click="close">
          <svg class="bi me-2" width="16" height="16"><use href="#user" /></svg>Кабинет
        </RouterLink>
      </li>
      <li v-if="!isLoggedIn">
        <RouterLink class="nav-link" :to="{ name: 'login' }" @click="close">Войти</RouterLink>
      </li>
      <li v-else>
        <button class="nav-link text-danger w-100 text-start" type="button" @click="handleLogout">
          <svg class="bi me-2" width="16" height="16"><use href="#logout" /></svg>Выйти
        </button>
      </li>
    </ul>
    <ThemeToggle />
  </nav>
</template>
