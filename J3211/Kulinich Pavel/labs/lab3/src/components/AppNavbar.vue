<script setup>
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';

const { isAuthenticated, currentUser, logout } = useAuth();
const router = useRouter();

function handleLogout() {
  logout();
  router.push({ name: 'home' });
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container">
      <router-link class="navbar-brand fw-bold" :to="{ name: 'home' }">TicketHub</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="Переключить навигацию"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'search' }">Поиск мероприятий</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'profile' }">Личный кабинет</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'organizer' }">Кабинет организатора</router-link>
          </li>
        </ul>
        <div class="d-flex gap-2 align-items-center">
          <template v-if="!isAuthenticated">
            <router-link :to="{ name: 'login' }" class="btn btn-outline-light">Вход</router-link>
            <router-link :to="{ name: 'register' }" class="btn btn-primary">Регистрация</router-link>
          </template>
          <template v-else>
            <span class="text-light small">{{ currentUser.firstName }}</span>
            <button class="btn btn-outline-light" @click="handleLogout">Выйти</button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
