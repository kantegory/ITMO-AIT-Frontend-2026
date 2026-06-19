<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Travel Planner</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/search">Поиск</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/profile">Личный кабинет</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Вход</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/register">Регистрация</router-link>
          </li>
        </ul>
        <button @click="toggleTheme" class="btn btn-sm btn-outline-secondary ms-2">
          {{ themeButtonText }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { useTheme } from '../composables/useTheme'

export default {
  name: 'Navbar',
  setup() {
    const { toggleTheme, themeButtonText } = useTheme()
    return { toggleTheme, themeButtonText }
  }
}
</script>