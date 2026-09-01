<script setup>
import { ChevronDown, GitBranch, Kanban, LayoutDashboard, ListChecks, LogOut, Users, X } from '@lucide/vue'

defineProps({ open: { type: Boolean, default: false } })
defineEmits(['close'])
</script>

<template>
  <Transition name="overlay">
    <button v-if="open" class="sidebar-overlay" type="button" aria-label="Закрыть меню" @click="$emit('close')"></button>
  </Transition>

  <aside :class="['app-sidebar', { 'is-open': open }]" aria-label="Боковая навигация">
    <div class="sidebar-mobile-head">
      <span class="brand brand-light"><span class="brand-mark"><GitBranch :size="21" /></span>Т‑Пульс</span>
      <button class="sidebar-close" type="button" aria-label="Закрыть меню" @click="$emit('close')"><X /></button>
    </div>

    <a class="brand brand-light sidebar-brand" href="#pageTitle" @click="$emit('close')">
      <span class="brand-mark"><GitBranch :size="22" /></span>
      <span>Т‑Пульс</span>
    </a>

    <button class="workspace-switcher" type="button">
      <span class="workspace-logo">DL</span>
      <span><small>Пространство</small><strong>Digital Lab</strong></span>
      <ChevronDown class="workspace-chevron" :size="18" />
    </button>

    <nav class="sidebar-nav" aria-label="Основная навигация">
      <span class="sidebar-caption">Работа</span>
      <a class="active" href="#pageTitle" @click="$emit('close')"><LayoutDashboard /><span>Обзор</span></a>
      <a href="#projects" @click="$emit('close')"><Kanban /><span>Проект</span></a>
      <a href="#tasks" @click="$emit('close')"><ListChecks /><span>Бэклог</span></a>
      <a href="#activity" @click="$emit('close')"><Users /><span>Команда</span></a>

      <span class="sidebar-caption sidebar-caption-spaced">Избранное</span>
      <a href="#projects" @click="$emit('close')"><span class="project-dot dot-yellow"></span><span>Мобильное приложение</span></a>
      <a href="#projects" @click="$emit('close')"><span class="project-dot dot-green"></span><span>Редизайн сайта</span></a>
    </nav>

    <div class="sidebar-profile">
      <span class="user-avatar">АБ</span>
      <span><strong>Александр Б.</strong><small>Администратор</small></span>
      <button type="button" aria-label="Выйти"><LogOut :size="19" /></button>
    </div>
  </aside>
</template>
