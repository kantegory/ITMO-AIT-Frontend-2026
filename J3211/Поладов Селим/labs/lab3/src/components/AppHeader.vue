<template>
  <div class="header-row">
    <h1>{{ title }}</h1>
    <div class="header-actions">
      <ThemeToggle />
      <div class="dropdown">
        <button
          type="button"
          class="user-menu dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          aria-label="Меню пользователя"
          aria-haspopup="true"
        >
          <div class="user-avatar" aria-hidden="true">
            <Icon name="user" :size="20" solid />
          </div>
          <span class="d-none d-md-inline">{{ fullName || '—' }}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end" role="menu">
          <li role="none"><router-link class="dropdown-item" to="/settings" role="menuitem">Настройки</router-link></li>
          <li role="none"><hr class="dropdown-divider" /></li>
          <li role="none"><a class="dropdown-item text-danger" href="#" role="menuitem" @click.prevent="onLogout">Выйти</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Icon from './Icon.vue'
import ThemeToggle from './ThemeToggle.vue'
import { useAuth } from '../composables/useAuth.js'

defineProps({ title: { type: String, required: true } })

const router = useRouter()
const { fullName, logout } = useAuth()

function onLogout() {
  logout()
  router.push('/login')
}
</script>
