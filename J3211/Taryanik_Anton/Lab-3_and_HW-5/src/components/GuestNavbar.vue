<template>
  <nav class="navbar navbar-expand-lg py-3">
    <div class="container d-flex justify-content-between align-items-center">
      <router-link class="brand-logo" to="/">
        <svg aria-hidden="true" width="28" height="28" class="brand-icon">
          <use href="../../public/img/sprite.svg#icon-logo"></use>
        </svg>
        LabelFlow
      </router-link>
      <div class="d-flex align-items-center gap-3">
        <button @click="toggleTheme" class="btn btn-link text-muted p-2 text-decoration-none border-0">
          <svg width="20" height="20" aria-hidden="true" style="stroke: currentColor;">
            <use :href="currentTheme === 'dark' ? '/img/sprite.svg#icon-sun' : '/img/sprite.svg#icon-moon'"></use>
          </svg>
        </button>
        <router-link v-if="showLogin" to="/login" class="nav-link fw-medium small text-muted p-0">Вход</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
defineProps({ showLogin: Boolean })
const { currentTheme, toggleTheme } = useTheme()
</script>