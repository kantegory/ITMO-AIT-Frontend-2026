<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
    <div class="container">
      <router-link class="navbar-brand fw-bold text-primary" to="/">EduPlatform</router-link>
      <button class="navbar-toggler" type="button"
        data-bs-toggle="collapse" data-bs-target="#navMenuVue"
        aria-controls="navMenuVue" aria-expanded="false" aria-label="Навигация">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenuVue">
        <ul class="navbar-nav me-auto" v-if="isLoggedIn">
          <li class="nav-item">
            <router-link class="nav-link" to="/courses" active-class="active">Каталог курсов</router-link>
          </li>
        </ul>
        <ul class="navbar-nav me-auto" v-else></ul>

        <!-- Гость -->
        <div v-if="!isLoggedIn" class="d-flex align-items-center gap-2">
          <router-link to="/login"    class="btn btn-primary btn-sm fw-semibold">Войти</router-link>
          <router-link to="/register" class="btn btn-outline-secondary btn-sm">Регистрация</router-link>
        </div>

        <!-- Авторизован -->
        <div v-else class="d-flex align-items-center gap-2">
          <span class="text-muted small">{{ user.firstName }} {{ user.lastName }}</span>
          <span v-if="isTeacher" class="badge bg-primary-subtle text-primary">Преподаватель</span>
          <router-link :to="isTeacher ? '/teacher' : '/dashboard'" class="btn btn-outline-primary btn-sm">
            Кабинет
          </router-link>
          <button class="btn btn-outline-secondary btn-sm" @click="logout">Выйти</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'TheNavbar',
  // setup() позволяет использовать composables внутри Options API
  setup() {
    return useAuth()
  }
}
</script>
