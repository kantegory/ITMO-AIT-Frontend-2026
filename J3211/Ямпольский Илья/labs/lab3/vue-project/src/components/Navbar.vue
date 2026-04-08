<template>
  <header role="banner">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Яндекс Афиша</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <SvgIcon name="icon-menu" size="md"/>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/" active-class="active">Главная</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/search" active-class="active">Поиск</router-link>
            </li>
            <li class="nav-item" v-if="auth.isAuthenticated">
              <router-link class="nav-link" to="/dashboard" active-class="active">Мои билеты</router-link>
            </li>
            <li class="nav-item" v-if="auth.isAuthenticated">
              <router-link class="nav-link" to="/returns" active-class="active">Возвраты</router-link>
            </li>
            <li class="nav-item" v-if="auth.isOrganizer">
              <router-link class="nav-link" to="/organizer" active-class="active">Организатор</router-link>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <button class="nav-link" @click="toggleTheme">
                <SvgIcon name="icon-theme" size="sm"/>
                Тема
              </button>
            </li>
            <li class="nav-item" v-if="auth.isAuthenticated">
              <a class="nav-link logout-link" href="#" @click.prevent="logout">
                <SvgIcon name="icon-logout" size="sm"/>
                Выход
              </a>
            </li>
            <li class="nav-item" v-else>
              <router-link class="nav-link" to="/login" active-class="active">Вход</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import SvgIcon from './icons/SvgIcon.vue'

export default {
  name: 'Navbar',
  components: { SvgIcon },
  setup() {
    const auth = useAuthStore()
    auth.loadFromStorage()

    const logout = () => {
      const theme = localStorage.getItem('theme')
      localStorage.clear()
      if (theme) localStorage.setItem('theme', theme)
      auth.logout()
      window.location.href = '/login'
    }

    const toggleTheme = () => {
      const current = document.documentElement.getAttribute('data-theme')
      const newTheme = current === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', newTheme)
      localStorage.setItem('theme', newTheme)
      location.reload()
    }

    return { auth, logout, toggleTheme }
  }
}
</script>
