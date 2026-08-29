<template>
  <aside class="col-12 col-md-3 col-lg-2 theme-sidebar border-end theme-border p-4 d-flex flex-column justify-content-between sidebar">
    <div>
      <h1 class="h2 theme-text-main fw-bold mb-4" style="letter-spacing: -0.5px;">
        <i class="bi bi-stack"></i>
        Moneta
      </h1>
      
      <nav class="nav flex-column gap-2">
        <router-link to="/dashboard" class="nav-link p-2 rounded-3 text-secondary" active-class="active-menu-item">
          <i class="bi bi-layout-sidebar me-1"></i>
          Главная панель
        </router-link>
        <router-link to="/search" class="nav-link p-2 rounded-3 text-secondary" active-class="active-menu-item">
          <i class="bi bi-search me-1"></i>
          Поиск транзакций
        </router-link>
        <a href="#" class="nav-link text-secondary p-2 rounded-3">
          <i class="bi bi-wallet me-1"></i>
          Кошелек
        </a>
        <a href="#" class="nav-link text-secondary p-2 rounded-3">
          <i class="bi bi-graph-up-arrow me-1"></i>
          Анализ и отчеты
        </a> 
      </nav>
    </div>
    
    <div>
      <a href="#" class="nav-link text-secondary p-2 rounded-3">
        <i class="bi bi-headphones me-1"></i>
        Помощь
      </a>
      <a href="#" class="nav-link text-secondary p-2 rounded-3">
        <i class="bi bi-gear me-1"></i>
        Настройки
      </a>
      <button @click="handleLogout" class="nav-link text-secondary p-2 rounded-3 btn border-0 w-100 text-start">
        <i class="bi bi-box-arrow-up-left me-1"></i>
        Выйти
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { logout } = useAuth()

const handleLogout = () => {
  logout()
  router.push('/')   
}
</script>

<style scoped>
@media (min-width: 768px) {
  aside.sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }
}
</style>