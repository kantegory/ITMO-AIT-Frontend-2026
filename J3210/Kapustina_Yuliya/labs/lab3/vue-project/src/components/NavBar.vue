<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">FanFicLib</router-link>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">
              Главная
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/search" active-class="active">
              Поиск
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/write" active-class="active">
              Написать фанфик
            </router-link>
          </li>
        </ul>
        
        <ul class="navbar-nav ms-auto">
          <template v-if="isAuthenticated">
            <li class="nav-item">
              <router-link class="nav-link" to="/profile" active-class="active">
                Профиль
              </router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="handleLogout">
                Выйти
              </a>
            </li>
          </template>
          
          <template v-else>
            <li class="nav-item">
              <router-link class="btn btn-light me-2" to="/login">
                Вход
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="btn btn-dark" to="/register">
                Регистрация
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { isAuthenticated, logout } = useAuth()

function handleLogout() {
  logout()
  router.push('/')
}
</script>