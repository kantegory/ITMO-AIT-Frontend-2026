<template>
  <aside class="sidebar d-flex flex-column" aria-label="Боковая панель">
    <router-link to="/dashboard" class="brand text-decoration-none" aria-label="67 Финансы — на главную">67 Финансы</router-link>
    <nav class="flex-grow-1 pt-2" aria-label="Основная навигация">
      <router-link
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="nav-link"
        active-class="active"
      >
        <Icon :name="item.icon" :size="20" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>
    <div class="nav-bottom px-3 pb-3">
      <a href="#" class="nav-link" aria-label="Выйти из аккаунта" @click.prevent="onLogout">
        <Icon name="logout" :size="20" />
        <span>Выход</span>
      </a>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Icon from './Icon.vue'
import { useAuth } from '../composables/useAuth.js'

const { logout } = useAuth()
const router = useRouter()

const items = [
  { to: '/dashboard', label: 'Главная', icon: 'home' },
  { to: '/transactions', label: 'Транзакции', icon: 'transactions' },
  { to: '/reports', label: 'Отчёты', icon: 'reports' },
  { to: '/integration', label: 'Интеграции', icon: 'integration' }
]

function onLogout() {
  logout()
  router.push('/login')
}
</script>
