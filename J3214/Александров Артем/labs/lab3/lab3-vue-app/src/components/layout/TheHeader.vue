<template>
  <header class="d-flex justify-content-between align-items-center mb-4 pb-2">
    <h1 class="h3 fw-bold m-0 theme-text-main" style="letter-spacing: -0.5px;">{{ title }}</h1>

    <div class="d-flex align-items-center gap-3">
      <!-- переключение темы -->
      <button 
        type="button" 
        class="btn p-0 border-0 rounded-circle d-flex justify-content-center align-items-center shadow-sm theme-circle-btn" 
        style="width: 44px; height: 44px;" 
        aria-label="Переключить тему"
        @click="toggleTheme"
      >
        <svg width="22" height="22" fill="currentColor" aria-hidden="true">
          <use href="/img/sprite.svg#icon-sun"></use>
        </svg>
      </button>

      <!-- уведомления -->
      <div 
        class="rounded-circle d-flex justify-content-center align-items-center shadow-sm theme-circle-btn" 
        style="width: 44px; height: 44px; cursor: pointer;"
      >
        <svg width="22" height="22" fill="currentColor" aria-hidden="true">
          <use href="/img/sprite.svg#icon-bell"></use>
        </svg>
      </div>

      <!-- иконка профиля -->
      <div 
        class="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" 
        style="width: 44px; height: 44px; cursor: pointer;" 
        aria-label="Профиль"
      >
        <svg width="22" height="22" fill="currentColor" aria-hidden="true">
          <use href="/img/sprite.svg#icon-person"></use>
        </svg>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

defineProps({
  title: {
    type: String,
    default: 'Личный кабинет'
  }
})

const { toggleTheme } = useTheme()
</script>