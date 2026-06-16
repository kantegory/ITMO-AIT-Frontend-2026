<script setup>
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'

const router = useRouter()

const { theme, toggleTheme } = useTheme()
const { user, logout } = useAuth()

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">

    <div class="container">

      <RouterLink
        class="navbar-brand fw-bold"
        to="/"
      >
        SECly
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        id="mainNav"
        class="collapse navbar-collapse"
      >

        <div class="navbar-nav ms-auto align-items-lg-center">

          <RouterLink
            class="nav-link"
            to="/"
          >
            Главная
          </RouterLink>

          <RouterLink
            class="nav-link"
            to="/catalog"
          >
            Каталог
          </RouterLink>

          <RouterLink
            v-if="user && user.role === 'student'"
            class="nav-link"
            to="/profile"
          >
            Личный кабинет
          </RouterLink>

          <RouterLink
            v-if="user && user.role === 'teacher'"
            class="nav-link"
            to="/teacher"
          >
            Кабинет преподавателя
          </RouterLink>

          <RouterLink
            v-if="!user"
            class="nav-link"
            to="/login"
          >
            Вход
          </RouterLink>

          <RouterLink
            v-if="!user"
            class="nav-link"
            to="/register"
          >
            Регистрация
          </RouterLink>

          <button
            v-if="user"
            class="btn btn-outline-light ms-lg-3 mt-2 mt-lg-0"
            @click="handleLogout"
          >
            Выйти
          </button>

          <button
            class="btn btn-light ms-lg-3 mt-2 mt-lg-0"
            @click="toggleTheme"
          >
            {{ theme === 'light' ? '⏾' : '☀︎' }}
          </button>

        </div>

      </div>

    </div>

  </nav>
</template>