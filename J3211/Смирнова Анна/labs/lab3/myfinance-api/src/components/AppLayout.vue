<template>
  <div>
    <a href="#main-content" class="visually-hidden-focusable p-2 bg-primary text-white text-decoration-none" style="position: absolute; top: 0; left: 0; z-index: 10000;">
      Перейти к основному контенту
    </a>

    <!-- Затемнение фона на мобильных устройствах -->
    <div 
      id="sidebar-overlay" 
      class="sidebar-overlay" 
      :class="{ show: isSidebarOpen }" 
      @click="isSidebarOpen = false"
      aria-hidden="true"
    ></div>

    <!-- Боковое меню -->
    <nav class="sidebar p-3 d-flex flex-column" id="sidebar" :class="{ show: isSidebarOpen }" aria-label="Основное меню">
        <router-link to="/dashboard" class="d-flex align-items-center mb-3 text-decoration-none" aria-label="На главную MyFinance">
            <svg class="bi text-primary fs-3 me-2" aria-hidden="true"><use href="/assets/sprite.svg#bi-wallet2"></use></svg>
            <span class="fs-4 fw-bold text-primary">MyFinance</span>
        </router-link>
        <hr aria-hidden="true">
        
        <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item">
                <router-link to="/dashboard" class="nav-link" active-class="active" aria-current="page">
                  <svg class="bi me-2" aria-hidden="true"><use href="/assets/sprite.svg#bi-grid-1x2"></use></svg> Обзор
                </router-link>
            </li>
            <li>
                <router-link to="/transactions" class="nav-link" active-class="active">
                  <svg class="bi me-2" aria-hidden="true"><use href="/assets/sprite.svg#bi-cash-stack"></use></svg> Транзакции
                </router-link>
            </li>
            <li>
                <router-link to="/goals" class="nav-link" active-class="active">
                  <svg class="bi me-2" aria-hidden="true"><use href="/assets/sprite.svg#bi-bullseye"></use></svg> Цели
                </router-link>
            </li>
            <li>
                <router-link to="/reports" class="nav-link" active-class="active">
                  <svg class="bi me-2" aria-hidden="true"><use href="/assets/sprite.svg#bi-pie-chart"></use></svg> Отчеты и Бюджеты
                </router-link>
            </li>
            <li>
                <router-link to="/integrations" class="nav-link" active-class="active">
                  <svg class="bi me-2" aria-hidden="true"><use href="/assets/sprite.svg#bi-bank"></use></svg> Интеграции
                </router-link>
            </li>
        </ul>
        
        <hr aria-hidden="true">
        
        <!-- Переключатель темы -->
        <button class="btn btn-link nav-link w-100 text-start d-flex align-items-center mb-2" @click="toggleTheme" aria-label="Переключить тему оформления">
            <svg class="bi me-2" aria-hidden="true">
                <use :href="theme === 'dark' ? '/assets/sprite.svg#bi-sun' : '/assets/sprite.svg#bi-moon-stars'"></use>
            </svg> 
            <span>{{ theme === 'dark' ? 'Светлая тема' : 'Тёмная тема' }}</span>
        </button>
        
        <a href="#" @click.prevent="logout" class="nav-link text-danger">
          <svg class="bi me-2" aria-hidden="true"><use href="/assets/sprite.svg#bi-box-arrow-left"></use></svg> Выход
        </a>
    </nav>

    <!-- Основной контент страницы -->
    <main class="main-content p-4" id="main-content" tabindex="-1">
      <slot name="header" :toggleSidebar="toggleSidebar"></slot>
      <slot></slot>
    </main>

    <GlobalModals />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useTheme } from '../composables/useTheme';
import GlobalModals from './GlobalModals.vue';

const { logout } = useAuth();
const { theme, toggleTheme } = useTheme();

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>