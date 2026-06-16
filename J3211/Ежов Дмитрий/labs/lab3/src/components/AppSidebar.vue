<script setup lang="ts">
import { computed } from 'vue';
import SvgIcon from './SvgIcon.vue';
import { useAuth } from '../composables/useAuth';
import { roleLabel } from '../utils/render';

const { user } = useAuth();

const initial = computed(() => user.value?.name.charAt(0).toUpperCase() ?? '·');
const displayRole = computed(() => (user.value ? roleLabel(user.value.role) : '—'));
</script>

<template>
  <aside class="sidebar" aria-label="Боковая навигация">
    <RouterLink to="/dashboard" class="sidebar-logo" aria-label="ТаскерAI — на главную">
      <div class="sidebar-logo-icon" aria-hidden="true">
        <SvgIcon name="logo" :size="17" />
      </div>
      <span class="sidebar-logo-name text-gradient">ТаскерAI</span>
    </RouterLink>

    <div class="sidebar-section">
      <p class="sidebar-section-label">Основное</p>
      <RouterLink to="/dashboard" class="nav-item" active-class="active">
        <SvgIcon name="grid" />
        Обзор
      </RouterLink>
      <RouterLink to="/search" class="nav-item" active-class="active">
        <SvgIcon name="search" />
        Поиск задач
      </RouterLink>
    </div>

    <div class="sidebar-section">
      <p class="sidebar-section-label">Проекты</p>
      <a href="#" class="nav-item" @click.prevent>
        <SvgIcon name="box" />
        ТаскерAI — ядро
      </a>
      <a href="#" class="nav-item" @click.prevent>
        <SvgIcon name="box" />
        AI-ассистент
      </a>
      <a href="#" class="nav-item" @click.prevent>
        <SvgIcon name="plus" />
        Новый проект
      </a>
    </div>

    <div class="sidebar-footer">
      <a href="#" class="user-card" @click.prevent>
        <div class="user-avatar">{{ initial }}</div>
        <div>
          <div class="user-info-name">{{ user?.name ?? '—' }}</div>
          <div class="user-info-role">{{ displayRole }}</div>
        </div>
      </a>
    </div>
  </aside>
</template>
