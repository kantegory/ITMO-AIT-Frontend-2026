<template>
  <nav class="navbar navbar-expand-lg border-bottom mb-4">
    <div class="container">
      <router-link class="brand-logo fs-5" to="/dashboard">
        <svg aria-hidden="true" width="24" height="24" class="brand-icon">
          <use href="../../public/img/sprite.svg#icon-logo"></use>
        </svg>
        LabelFlow
      </router-link>
      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center fw-medium">
          <li class="nav-item">
            <router-link class="nav-link px-3" active-class="active" to="/dashboard">Проекты</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link px-3" active-class="active" to="/search">Поиск</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link px-3" active-class="active" to="/workers">Команда</router-link>
          </li>
          <li class="nav-item ms-lg-2">
            <button @click="toggleTheme" class="btn btn-link text-muted p-2 text-decoration-none border-0">
              <svg width="20" height="20" aria-hidden="true" style="stroke: currentColor;">
                <use :href="currentTheme === 'dark' ? '/img/sprite.svg#icon-sun' : '/img/sprite.svg#icon-moon'"></use>
              </svg>
            </button>
          </li>
          <li class="nav-item ms-lg-3 mt-3 mt-lg-0">
            <router-link to="/profile" class="d-flex align-items-center text-decoration-none" active-class="active">
              <div class="rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm" style="width: 38px; height: 38px; background-color: var(--lf-primary); font-size: 0.95rem;">
                {{ userInitials }}
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useTheme } from '../composables/useTheme'

const authStore = useAuthStore()
const { currentTheme, toggleTheme } = useTheme()

const userInitials = computed(() => {
  if (!authStore.user) return 'U'
  const parts = authStore.user.name.trim().split(' ')
  const initials = (parts[0] ? parts[0][0] : '') + (parts[1] ? parts[1][0] : '')
  return initials.toUpperCase() || 'U'
})
</script>