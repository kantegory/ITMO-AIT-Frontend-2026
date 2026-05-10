<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { currentUser, isAuthenticated, isTeacher, logout } = useAuth()
const { showToast } = useToast()

const scrolled = ref(false)
const onScroll = () => {
  scrolled.value = window.scrollY > 30
}

onMounted(() => window.addEventListener('scroll', onScroll))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const handleLogout = (event) => {
  event?.preventDefault?.()
  logout()
  showToast('Вы вышли из аккаунта', 'success')
  setTimeout(() => router.push({ name: 'login' }), 700)
}
</script>

<template>
  <nav
    class="navbar navbar-expand-lg fixed-top"
    :class="{ shadow: scrolled }"
    aria-label="Основная навигация"
  >
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'home' }">
        <svg class="svg-icon" aria-hidden="true">
          <use href="/sprite/sprite.svg#icon-mortarboard"></use>
        </svg>
        MokiichukKnowledge
      </router-link>

      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Открыть меню навигации"
      >
        <span class="navbar-toggler-icon" aria-hidden="true"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto ms-3">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'home' }" exact-active-class="active">
              Главная
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'catalog' }" active-class="active">
              Каталог
            </router-link>
          </li>
          <li class="nav-item" v-if="isTeacher">
            <router-link class="nav-link" :to="{ name: 'teacher' }" active-class="active">
              Преподавателям
            </router-link>
          </li>
        </ul>

        <div class="d-flex gap-2" v-if="!isAuthenticated">
          <router-link :to="{ name: 'login' }" class="btn btn-outline-primary btn-sm">Войти</router-link>
          <router-link :to="{ name: 'register' }" class="btn btn-primary btn-sm">Регистрация</router-link>
        </div>

        <div class="d-flex gap-2" v-else-if="isTeacher">
          <router-link :to="{ name: 'teacher' }" class="btn btn-outline-primary btn-sm">Кабинет</router-link>
          <router-link :to="{ name: 'profile' }" class="btn btn-primary btn-sm">Профиль</router-link>
        </div>

        <div class="dropdown" v-else>
          <button
            class="btn btn-outline-primary btn-sm dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            id="profileDropdownBtn"
            aria-expanded="false"
            aria-haspopup="true"
            aria-label="Меню пользователя"
          >
            <i class="bi bi-person-circle me-1" aria-hidden="true"></i>
            <span>{{ currentUser?.name || 'Профиль' }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdownBtn">
            <li>
              <router-link class="dropdown-item" :to="{ name: 'profile' }">
                <i class="bi bi-person me-2" aria-hidden="true"></i>Профиль
              </router-link>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item text-danger" href="#" @click="handleLogout">
                <i class="bi bi-box-arrow-right me-2" aria-hidden="true"></i>Выйти
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  <div class="mt-navbar-lg"></div>
</template>
