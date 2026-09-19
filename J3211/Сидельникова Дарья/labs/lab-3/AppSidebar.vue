<script setup>
import { useAuth } from '@/composables/useAuth'
import ThemeToggle from './ThemeToggle.vue'
import { useRouter } from 'vue-router'

const { logout } = useAuth()
const router = useRouter()

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <aside class="sidebar p-3 text-white">
    <h4 class="logo text-white mb-4">
      <router-link to="/dashboard" class="text-white text-decoration-none">PRIME</router-link>
    </h4>

    <ul class="nav flex-column">
      <li class="nav-item mb-2">
        <router-link class="nav-link text-white" to="/dashboard">Dashboard</router-link>
      </li>

      <li class="nav-item mb-2">
        <router-link class="nav-link text-white" to="/create-project">Create project</router-link>
      </li>

      <li class="nav-item mb-2">
        <router-link class="nav-link text-white" to="/add-task">Create new task</router-link>
      </li>

      <li class="nav-item mt-3">
        <ThemeToggle />
      </li>

      <li class="nav-item mt-3">
        <button class="btn btn-outline-light btn-sm" @click="handleLogout">Logout</button>
      </li>
    </ul>
  </aside>
</template>