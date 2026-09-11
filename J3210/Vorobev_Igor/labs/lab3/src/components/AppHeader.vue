<template>
  <header>
    <nav class="navbar border-bottom">
      <div class="container-fluid app-container d-flex align-items-center justify-content-between gap-3">
        <RouterLink class="navbar-brand" to="/projects">Project Manager</RouterLink>

        <div class="d-flex align-items-center gap-2">
          <ThemeToggle />
          <span v-if="currentUser" class="small user-name">
            {{ currentUser.name || currentUser.email }}
          </span>
          <button v-if="currentUser" class="btn btn-sm btn-logout" type="button" @click="handleLogout">
            Выйти
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { currentUser, logout } = useAuth()

function handleLogout() {
  logout()
  router.push({ name: 'home' })
}
</script>
