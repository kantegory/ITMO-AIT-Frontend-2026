<template>
  <aside class="sidebar">
    <div class="sidebar__logo">MLPipelines</div>
    <div class="sidebar__scroll-wrapper">
      <nav class="sidebar__nav" aria-label="Главное меню">
        <router-link
          to="/"
          class="sidebar__link"
          active-class=""
          exact-active-class="sidebar__link--active"
        >
          <svg width="20" height="20" class="me-2"><use href="/img/sprite.svg#icon-home"></use></svg>
          Личный кабинет
        </router-link>
        <router-link
          to="/experiments"
          class="sidebar__link"
          active-class="sidebar__link--active"
        >
          <svg width="20" height="20" class="me-2"><use href="/img/sprite.svg#icon-experiments"></use></svg>
          Эксперименты
        </router-link>
        <router-link
          to="/models"
          class="sidebar__link"
          active-class="sidebar__link--active"
        >
          <svg width="20" height="20" class="me-2"><use href="/img/sprite.svg#icon-models"></use></svg>
          Модели
        </router-link>
      </nav>

      <footer class="sidebar__footer dropdown">
        <a
          href="#"
          class="sidebar__link dropdown-toggle text-decoration-none text-truncate"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <svg width="20" height="20" class="me-2"><use href="/img/sprite.svg#icon-user"></use></svg>
          <span>{{ currentUser?.name || 'Загрузка...' }}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-dark">
          <li>
            <a class="dropdown-item" href="#" @click.prevent="$emit('openSettings')">Настройки</a>
          </li>
          <li>
            <a class="dropdown-item text-danger" href="#" @click.prevent="handleLogout">Выйти</a>
          </li>
        </ul>
      </footer>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

defineEmits(['openSettings'])

const router = useRouter()
const { currentUser, logout } = useAuth()

function handleLogout() {
  logout()
  router.push('/login')
}
</script>
