<script setup>
import { ChevronDown, GitBranch, Kanban, LayoutDashboard, ListChecks, LogOut, Users, X } from '@lucide/vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

defineProps({ open: { type: Boolean, default: false } })
defineEmits(['close'])
const auth = useAuthStore()
const router = useRouter()
const displayName = computed(() => auth.user?.firstName ? `${auth.user.firstName} ${auth.user.lastName?.[0] ?? ''}.` : 'Александр Б.')
const initials = computed(() => auth.user?.firstName ? `${auth.user.firstName[0]}${auth.user.lastName?.[0] ?? ''}`.toUpperCase() : 'АБ')

async function logout() {
  auth.logout()
  await router.replace('/login')
}
</script>

<template>
  <Transition name="overlay"><button v-if="open" class="sidebar-overlay" type="button" aria-label="Закрыть меню" @click="$emit('close')"></button></Transition>
  <aside :class="['app-sidebar', { 'is-open': open }]" aria-label="Боковая навигация">
    <div class="sidebar-mobile-head"><span class="brand brand-light"><span class="brand-mark"><GitBranch :size="21" /></span>Т‑Пульс</span><button class="sidebar-close" type="button" aria-label="Закрыть меню" @click="$emit('close')"><X /></button></div>
    <RouterLink class="brand brand-light sidebar-brand" to="/dashboard" @click="$emit('close')"><span class="brand-mark"><GitBranch :size="22" /></span><span>Т‑Пульс</span></RouterLink>
    <button class="workspace-switcher" type="button"><span class="workspace-logo">DL</span><span><small>Пространство</small><strong>Digital Lab</strong></span><ChevronDown class="workspace-chevron" :size="18" /></button>

    <nav class="sidebar-nav" aria-label="Основная навигация">
      <span class="sidebar-caption">Работа</span>
      <RouterLink to="/dashboard" @click="$emit('close')"><LayoutDashboard /><span>Обзор</span></RouterLink>
      <RouterLink to="/project" @click="$emit('close')"><Kanban /><span>Проект</span></RouterLink>
      <RouterLink to="/backlog" @click="$emit('close')"><ListChecks /><span>Бэклог</span></RouterLink>
      <RouterLink to="/team" @click="$emit('close')"><Users /><span>Команда</span></RouterLink>
      <span class="sidebar-caption sidebar-caption-spaced">Избранное</span>
      <RouterLink v-slot="{ href, navigate }" to="/project" custom>
        <a :href="href" @click="navigate($event); $emit('close')"><span class="project-dot dot-yellow"></span><span>Мобильное приложение</span></a>
      </RouterLink>
      <RouterLink v-slot="{ href, navigate }" to="/project" custom>
        <a :href="href" @click="navigate($event); $emit('close')"><span class="project-dot dot-green"></span><span>Редизайн сайта</span></a>
      </RouterLink>
    </nav>

    <div class="sidebar-profile">
      <span class="user-avatar">{{ initials }}</span>
      <span><strong>{{ displayName }}</strong><small>{{ auth.user?.role ?? 'Администратор' }}</small></span>
      <button type="button" aria-label="Выйти" @click="logout"><LogOut :size="19" /></button>
    </div>
  </aside>
</template>
