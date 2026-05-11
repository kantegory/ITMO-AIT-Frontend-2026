<template>
  <header class="header">
    <nav class="navbar navbar-expand-lg fixed-top navigation">
      <div class="container">
        <router-link class="navbar-brand me-auto" to="/">Мероприятия</router-link>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title">Мероприятия</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav justify-content-center flex-grow-1 pe-3">
              <li class="nav-item">
                <router-link class="nav-link mx-lg-2" to="/" active-class="active">Главная</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link mx-lg-2" :to="profileLink" active-class="active">Личный кабинет</router-link>
              </li>
            </ul>
          </div>
        </div>

        <router-link v-if="!isLoggedIn" to="/login" class="login-button">Войти</router-link>
        <template v-else>
          <span class="login-button login-button--profile me-2">{{ displayName }}</span>
          <button class="subtle-button" @click="handleLogout">Выйти</button>
        </template>

        <button class="navbar-toggler pe-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { mapState, mapActions } from 'pinia'
import useAuthStore from '@/stores/auth'

export default {
  name: 'AppNavbar',
  computed: {
    ...mapState(useAuthStore, ['isLoggedIn', 'user']),
    displayName() {
      const u = this.user
      if (!u) return ''
      return `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email || 'Профиль'
    },
    profileLink() {
      if (!this.isLoggedIn) return '/profile'
      const role = this.user?.role
      if (role === 'admin') return '/admin'
      if (role === 'teacher') return '/teacher'
      return '/profile'
    }
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