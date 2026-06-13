<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">UCL Tickets</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <div class="navbar-nav ms-auto">
          <router-link class="nav-link" to="/" data-icon="home">Home</router-link>
          <router-link class="nav-link" to="/tickets" data-icon="tickets">Tickets</router-link>
          <router-link v-if="auth.isAuthenticated" class="nav-link" to="/dashboard" data-icon="user">My Account</router-link>
          <router-link v-if="!auth.isAuthenticated" class="nav-link" to="/login">Sign In</router-link>
          <router-link v-if="!auth.isAuthenticated" class="nav-link" to="/register">Register</router-link>

          <div class="nav-item d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">
            <button class="btn btn-sm btn-outline-light d-flex align-items-center gap-2" style="border-radius: 20px;" @click="handleToggleTheme">
              <svg class="icon" style="margin-right:0;"><use :href="`/sprite.svg#icon-${theme === 'light' ? 'moon' : 'theme'}`"></use></svg>
              <span>{{ theme === 'light' ? 'Dark Mode' : 'Light Mode' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { injectIcons } from '@/composables/useIcons'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/auth'

const { theme, toggleTheme } = useTheme()
const auth = useAuthStore()

const handleToggleTheme = () => {
  toggleTheme()
}

onMounted(() => {
  injectIcons()
})
</script>
