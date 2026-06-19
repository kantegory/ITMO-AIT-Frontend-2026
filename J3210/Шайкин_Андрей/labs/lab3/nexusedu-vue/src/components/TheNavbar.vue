<template>
  <header v-if="showNavbar">
    <nav class="navbar navbar-expand-lg glass m-3 px-4 py-3" aria-label="Главная навигация">
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold fs-4" :to="{ name: 'catalog' }">
          <svg width="24" height="24" class="me-2"><use href="#icon-logo"></use></svg>NexusEdu
        </router-link>
        
        <button class="navbar-toggler border-0 shadow-none" type="button" @click="isMenuOpen = !isMenuOpen">
          <svg width="26" height="26"><use href="#icon-menu"></use></svg>
        </button>
        
        <div class="collapse navbar-collapse" :class="{ show: isMenuOpen }" id="navBar">
          <ul class="navbar-nav me-auto ms-4 gap-3">
            <li class="nav-item">
              <router-link @click="isMenuOpen = false" class="nav-link fw-bold" :to="{ name: 'catalog' }">Каталог</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link @click="isMenuOpen = false" class="nav-link fw-bold" :to="{ name: 'profile' }">Мой кабинет</router-link>
            </li>
          </ul>
          
          <div class="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            <button @click="toggleTheme" class="btn btn-sm btn-outline-secondary rounded-pill">
              <svg width="18" height="18"><use href="#icon-theme"></use></svg><span>Тема</span>
            </button>
            <template v-if="isAuthenticated">
              <span class="d-none d-md-inline">Привет, <span class="d-none d-md-inline">{{ user?.firstName }}</span>!</span>
              <button @click="logout(); isMenuOpen = false" class="btn btn-sm btn-adaptive-outline rounded-pill">Выйти</button>
            </template>
            <template v-else>
              <router-link :to="{ name: 'auth' }" @click="isMenuOpen = false" class="btn glass-btn px-4">Войти</router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useAuth } from '@/composables/useAuth'

const { toggleTheme } = useTheme()
const { user, isAuthenticated, logout } = useAuth()

const route = useRoute()
const showNavbar = computed(() => route.name !== 'auth')
const isMenuOpen = ref(false)
</script>

<style scoped>
.navbar .navbar-brand,
.navbar .nav-link,
.text-adaptive {
  color: var(--text-color);
}

a {
  text-decoration: none;
}

.navbar-brand {
  transition: all 0.4s ease;
}

.nav-link {
  border-bottom: 2px solid transparent;
  transition: all 0.4s ease;
}

.navbar-nav .nav-link.router-link-active {
  color: var(--text-color);
  border-bottom-color: var(--text-color);
}

.navbar-brand.router-link-active {
  border-bottom: none;
}

.nav-link:hover {
  border-bottom-color: var(--text-muted);
}
</style>