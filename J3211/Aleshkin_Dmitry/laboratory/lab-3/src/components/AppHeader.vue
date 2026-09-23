<template>
  <header class="app-header">
    <div class="container">
      <div class="header-row">
        <RouterLink class="brand" :to="{ name: 'dashboard' }">
          <svg class="icon" aria-hidden="true">
            <use href="/img/sprite.svg#icon-wallet"></use>
          </svg>
          <span>FinanceManager</span>
        </RouterLink>

        <nav class="main-nav">
          <RouterLink class="nav-item-link" :to="{ name: 'dashboard' }">Личный кабинет</RouterLink>
          <RouterLink class="nav-item-link" :to="{ name: 'transactions' }">Транзакции</RouterLink>
          <RouterLink class="nav-item-link" :to="{ name: 'reports' }">Отчёты</RouterLink>
          <RouterLink class="nav-item-link" :to="{ name: 'integrations' }">Интеграции</RouterLink>
        </nav>

        <div class="header-actions">
          <div v-if="rates" class="rates-badge">
            $: {{ formattedUsd }} | €: {{ formattedEur }}
          </div>

          <button class="theme-btn" type="button" @click="$emit('toggle-theme')">
            <svg class="icon" aria-hidden="true">
              <use :href="`/img/sprite.svg#${themeIcon}`"></use>
            </svg>
            <span>{{ themeLabel }}</span>
          </button>

          <button
            v-if="isAuthenticated"
            class="header-btn header-btn-outline"
            type="button"
            @click="$emit('logout')"
          >
            Выйти
          </button>

          <template v-else>
            <RouterLink class="header-btn header-btn-outline" :to="{ name: 'login' }">
              Войти
            </RouterLink>

            <RouterLink class="header-btn header-btn-primary" :to="{ name: 'register' }">
              Регистрация
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  isAuthenticated: Boolean,
  rates: Object,
  themeLabel: String,
  themeIcon: String,
});

defineEmits(['logout', 'toggle-theme']);

const formattedUsd = computed(() => Number(props.rates?.USD || 0).toFixed(2));
const formattedEur = computed(() => Number(props.rates?.EUR || 0).toFixed(2));
</script>