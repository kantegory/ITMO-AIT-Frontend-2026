<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-icon">
        <svg class="svg-icon"><use href="#icon-diagram-3-fill"></use></svg>
      </div>
      <span class="brand-name">MLPipe</span>
    </div>

    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: route.name === item.name }"
      >
        <svg class="svg-icon" aria-hidden="true"><use :href="'#icon-' + item.icon"></use></svg>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="s-user">
        <div class="s-avatar">{{ userInitial }}</div>
        <div>
          <div class="s-name">{{ user?.name || '—' }}</div>
          <div class="s-role">{{ user?.role || '' }}</div>
        </div>
      </div>
      <button class="s-logout" @click="doLogout" title="Выйти" aria-label="Выйти из системы">
        <svg class="svg-icon"><use href="#icon-box-arrow-right"></use></svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const route  = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const userInitial = computed(() => user.value?.name?.[0]?.toUpperCase() || '?')

const navItems = [
  { to: '/dashboard',   name: 'dashboard',   label: 'Дашборд',       icon: 'grid-1x2-fill' },
  { to: '/experiments', name: 'experiments', label: 'Эксперименты',  icon: 'activity' },
  { to: '/models',      name: 'models',      label: 'Модели',        icon: 'box-seam-fill' },
  { to: '/artifacts',   name: 'artifacts',   label: 'Артефакт-стор', icon: 'archive-fill' },
  { to: '/profile',     name: 'profile',     label: 'Мой кабинет',   icon: 'person-fill' },
]

async function doLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>
