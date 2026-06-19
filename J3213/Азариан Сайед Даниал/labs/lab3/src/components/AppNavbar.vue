<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { currentUser, cabinetRoute, loadCurrentUser, logout } = useAuth()

defineProps({
  activePage: {
    type: String,
    default: 'home',
  },
})

onMounted(() => {
  loadCurrentUser()
})

function handleLogout() {
  logout()
  router.push('/auth')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">EventPass</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#appNav"
        aria-controls="appNav"
        aria-expanded="false"
        aria-label="Переключить навигацию"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="appNav" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" :class="{ active: activePage === 'home' }" to="/">Главная</RouterLink>
          </li>
          <li v-if="activePage === 'event'" class="nav-item">
            <span class="nav-link active">Мероприятие</span>
          </li>
          <li v-if="currentUser?.accountType === 'buyer'" class="nav-item">
            <RouterLink class="nav-link" :class="{ active: activePage === 'profile' }" to="/profile">
              Личный кабинет
            </RouterLink>
          </li>
          <li v-if="currentUser?.accountType === 'organizer'" class="nav-item">
            <RouterLink class="nav-link" :class="{ active: activePage === 'organizer' }" to="/organizer">
              Кабинет организатора
            </RouterLink>
          </li>
        </ul>

        <div class="d-flex gap-2 align-items-center">
          <ThemeToggle />

          <template v-if="currentUser">
            <RouterLink class="btn btn-primary" :to="cabinetRoute">
              {{ currentUser.accountType === 'organizer' ? 'Кабинет организатора' : 'Личный кабинет' }}
            </RouterLink>
            <button class="btn btn-outline-primary" type="button" @click="handleLogout">Выйти</button>
          </template>

          <template v-else>
            <RouterLink class="btn btn-outline-primary" to="/auth">Вход</RouterLink>
            <RouterLink class="btn btn-primary" to="/auth">Регистрация</RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
