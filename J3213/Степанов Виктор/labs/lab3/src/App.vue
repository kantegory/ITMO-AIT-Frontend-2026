<template>
  <div :data-theme="theme">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <RouterLink class="navbar-brand fw-bold" to="/">🧠 ModelHub</RouterLink>
        <div class="d-flex gap-2 align-items-center">
          <RouterLink class="nav-link text-white" to="/search">Каталог</RouterLink>
          <RouterLink v-if="loggedIn" class="nav-link text-white" to="/dashboard">Кабинет</RouterLink>
          <RouterLink v-if="!loggedIn" class="btn btn-outline-light btn-sm" to="/login">Войти</RouterLink>
          <span v-if="loggedIn" class="text-white" style="font-size:14px;">@{{ user?.username }}</span>
          <button v-if="loggedIn" class="btn btn-outline-light btn-sm" @click="handleLogout">Выйти</button>
          <button class="theme-toggle" @click="toggleTheme">{{ theme === 'dark' ? '☀️' : '🌙' }} Тема</button>
        </div>
      </div>
    </nav>
    <RouterView />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth.js'

const router = useRouter()
const { user, loggedIn, logout, checkSession } = useAuth()

const theme = ref('light')

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
}

async function handleLogout() {
  await logout()
  router.push('/')
}

onMounted(async () => {
  const saved = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  theme.value = saved || (prefersDark ? 'dark' : 'light')
  await checkSession()
})
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';

:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-card: #ffffff;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --border-color: #dee2e6;
  --input-bg: #ffffff;
  --input-text: #212529;
}

[data-theme="dark"] {
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --bg-card: #2a2a2a;
  --text-primary: #e0e0e0;
  --text-secondary: #aaaaaa;
  --border-color: #444444;
  --input-bg: #2a2a2a;
  --input-text: #e0e0e0;
}

body { background-color: var(--bg-primary); color: var(--text-primary); transition: background-color 0.3s, color 0.3s; }
.card { background-color: var(--bg-card) !important; border-color: var(--border-color) !important; color: var(--text-primary) !important; }
.text-muted { color: var(--text-secondary) !important; }
.form-control, .form-select { background-color: var(--input-bg) !important; color: var(--input-text) !important; border-color: var(--border-color) !important; }
.list-group-item { background-color: var(--bg-card) !important; border-color: var(--border-color) !important; color: var(--text-primary) !important; }

.theme-toggle {
  background: none; border: 1px solid rgba(255,255,255,0.3);
  border-radius: 20px; padding: 4px 12px; cursor: pointer;
  font-size: 14px; color: white;
}
</style>
