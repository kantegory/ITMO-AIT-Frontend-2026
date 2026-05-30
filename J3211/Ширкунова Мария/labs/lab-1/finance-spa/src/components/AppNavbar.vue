<script setup>
import { useAuth } from '@/composables/useAuth'
const { logout } = useAuth()
</script>

<template>
  <header class="app-header bg-dark text-white">
    <nav class="container navbar navbar-expand-lg navbar-dark">
      <router-link class="navbar-brand" to="/">Мои Финансы</router-link>
      <button class="navbar-toggler" type="button"
              data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><router-link class="nav-link" to="/">Обзор</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/transactions">Транзакции</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/reports">Отчёты</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/integrations">Интеграции</router-link></li>
          <li class="nav-item">
            <a class="nav-link text-danger" href="#" @click.prevent="logout">Выход</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
