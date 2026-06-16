<template>
  <header class="header">
    <nav class="navbar navbar-expand-lg fixed-top navigation">
      <div class="container">
        <router-link class="navbar-brand me-auto" to="/">Мероприятия</router-link>
        <div class="d-flex align-items-center gap-2">
          <router-link to="/" class="nav-link">Главная</router-link>
          <router-link to="/profile" class="nav-link">Профиль</router-link>
          <router-link v-if="!isLoggedIn" to="/login" class="login-button">Войти</router-link>
          <button v-else class="subtle-button" @click="handleLogout">Выйти</button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import useAuthStore from '@/stores/auth.js'

export default {
  name: 'AppNavbar',
  computed: {
    ...mapState(useAuthStore, ['isLoggedIn'])
  },
  methods: {
    ...mapActions(useAuthStore, ['logout']),
    handleLogout() {
      this.logout()
      this.$router.push('/login')
    }
  }
}
</script>