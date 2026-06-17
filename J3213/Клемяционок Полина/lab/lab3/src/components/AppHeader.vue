<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-danger">
    <div class="container">
      <router-link to="/" class="navbar-brand fw-bold"> простоВождение</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><router-link to="/#packages" class="nav-link">Пакеты</router-link></li>
          <li class="nav-item"><router-link to="/lectures" class="nav-link">Лекции</router-link></li>
          <li class="nav-item"><router-link to="/instructor" class="nav-link">Инструктор</router-link></li>
        </ul>
        <div class="d-flex align-items-center gap-3">
          <template v-if="isLoggedIn">
            <span class="text-white">{{ user.name }}</span>
            <router-link :to="user.role === 'student' ? '/student' : '/instructor/dashboard'" class="btn btn-outline-light btn-sm">ЛК</router-link>
            <button @click="logout" class="btn btn-light btn-sm">Выйти</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-light btn-sm">Войти</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'
const { user, isLoggedIn, logout } = useAuth()
</script>