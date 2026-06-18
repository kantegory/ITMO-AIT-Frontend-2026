<template>
  <header class="ticket-platform__header navbar navbar-expand-lg navbar-dark" role="banner">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" :to="logoRoute">Билеты Петербурга</RouterLink>
      <button class="navbar-toggler" type="button" aria-controls="navbarNav" :aria-expanded="menuOpen" aria-label="Переключить навигацию" @click="menuOpen = !menuOpen">
        <SvgIcon name="bars" />
      </button>
      <div id="navbarNav" class="collapse navbar-collapse" :class="{ show: menuOpen }" role="navigation">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/search">Поиск</RouterLink>
          </li>
          <li v-if="userRole === 'user'" class="nav-item">
            <RouterLink class="nav-link" to="/dashboard">Мои билеты</RouterLink>
          </li>
          <li v-if="userRole === 'organizer'" class="nav-item">
            <RouterLink class="nav-link" to="/organizer">Организатор</RouterLink>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <a class="nav-link" href="#" @click.prevent="handleLogout">Выйти</a>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from './SvgIcon.vue'
import { useAuth } from '../composables/useAuth'
const router = useRouter()
const menuOpen = ref(false)
const { isAuthenticated, userRole, logout } = useAuth()
const logoRoute = computed(() => userRole.value === 'organizer' ? '/organizer' : '/dashboard')
function handleLogout() {
  logout()
  router.push('/login')
}
</script>
