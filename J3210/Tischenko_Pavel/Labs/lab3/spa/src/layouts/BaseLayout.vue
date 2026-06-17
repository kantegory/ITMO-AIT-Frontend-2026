<template>
  <div class="app-shell">
    <header class="border-bottom bg-body">
      <nav class="container py-3 d-flex align-items-center justify-content-between gap-3 flex-wrap">
        <div class="d-flex align-items-center gap-3">
          <router-link class="fw-semibold text-decoration-none text-body" to="/">
            Подвал обучения
          </router-link>
          <router-link class="small text-decoration-none" :to="{ name: 'catalog' }">
            Каталог
          </router-link>
          <router-link
            v-if="!isAuthenticated"
            class="small text-decoration-none"
            :to="{ name: 'auth' }"
          >
            Вход / Регистрация
          </router-link>
          <router-link
            v-if="isAuthenticated && roleLabel === 'студент'"
            class="small text-decoration-none"
            :to="{ name: 'student' }"
          >
            Кабинет студента
          </router-link>
          <router-link
            v-if="isAuthenticated && roleLabel === 'тренер'"
            class="small text-decoration-none"
            :to="{ name: 'teacher' }"
          >
            Кабинет тренера
          </router-link>
        </div>

        <div class="d-flex align-items-center gap-2">
          <small v-if="isAuthenticated" class="text-secondary">
            {{ userName }} <span v-if="roleLabel">({{ roleLabel }})</span>
          </small>
          <button class="btn btn-sm btn-outline-secondary" type="button" @click="toggleTheme">
            Тема: {{ theme === 'dark' ? 'тёмная' : 'светлая' }}
          </button>
          <button
            v-if="isAuthenticated"
            class="btn btn-sm btn-outline-danger"
            type="button"
            @click="logout"
          >
            Выйти
          </button>
        </div>
      </nav>
    </header>
    <main class="container py-4">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useSession } from '../composables/useSession'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()
const { isAuthenticated, roleLabel, userName, logout } = useSession()
</script>
