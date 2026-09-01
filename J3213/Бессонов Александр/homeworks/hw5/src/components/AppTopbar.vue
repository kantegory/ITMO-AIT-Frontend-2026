<script setup>
import { Bell, Home, Menu, Moon, Plus, Search, Sun } from '@lucide/vue'

defineProps({
  theme: { type: String, required: true },
  unreadCount: { type: Number, required: true },
  searchOpen: { type: Boolean, default: false },
})

defineEmits(['toggle-theme', 'toggle-sidebar', 'toggle-search', 'toggle-notifications', 'new-task'])
</script>

<template>
  <header class="app-topbar">
    <button class="icon-button mobile-menu" type="button" aria-label="Открыть меню" @click="$emit('toggle-sidebar')">
      <Menu />
    </button>
    <div class="topbar-title"><strong>Обзор</strong><small>Проекты и задачи команды</small></div>
    <nav class="topbar-actions" aria-label="Действия приложения">
      <button
        class="icon-button"
        type="button"
        :aria-label="theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'"
        @click="$emit('toggle-theme')"
      >
        <Sun v-if="theme === 'dark'" />
        <Moon v-else />
      </button>
      <button :class="['icon-button', { active: searchOpen }]" type="button" aria-label="Открыть поиск" @click="$emit('toggle-search')"><Search /></button>
      <a class="icon-button topbar-home" href="#pageTitle" aria-label="К началу страницы"><Home /></a>
      <button class="icon-button notification-button" type="button" aria-label="Открыть уведомления" @click="$emit('toggle-notifications')">
        <Bell />
        <span v-if="unreadCount" class="notification-count">{{ unreadCount }}</span>
      </button>
      <button class="primary-button" type="button" @click="$emit('new-task')"><Plus /><span>Новая задача</span></button>
    </nav>
  </header>
</template>
