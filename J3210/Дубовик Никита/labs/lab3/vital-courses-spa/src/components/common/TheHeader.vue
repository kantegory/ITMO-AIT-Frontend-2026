<template>
  <header role="banner">
    <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top shadow-sm"
         role="navigation" aria-label="Основная навигация">
      <router-link class="navbar-brand fw-bold ms-3" to="/">
        <svg class="icon icon-lg me-1 text-primary" aria-hidden="true">
          <use href="#icon-graduation-cap"></use>
        </svg>
        Vital <span class="text-primary">Courses</span>
      </router-link>

      <button class="navbar-toggler border-0" type="button"
              data-bs-toggle="collapse" data-bs-target="#navbarContent"
              aria-controls="navbarContent" aria-expanded="false"
              aria-label="Переключить навигацию">
        <span class="navbar-toggler-icon" aria-hidden="true"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-center" id="navbarContent">
        <ul class="navbar-nav align-items-center" role="list">
          <li class="nav-item" role="listitem">
            <router-link class="nav-link" to="/" active-class="active" aria-current="page">Главная</router-link>
          </li>
          <li class="nav-item" role="listitem"><a class="nav-link" href="#">О платформе</a></li>
          <li class="nav-item" role="listitem"><a class="nav-link" href="#">Преподавателям</a></li>
          <li class="nav-item" role="listitem">
            <router-link class="nav-link" to="/catalog" active-class="active">Каталог курсов</router-link>
          </li>
        </ul>

        <div v-if="!isAuthenticated" class="d-flex align-items-center gap-2 ms-lg-1">
          <button class="btn btn-outline-primary px-3 d-flex align-items-center" @click="$emit('open-login')">
            <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-right-to-bracket"></use></svg>
            Вход
          </button>
          <button class="btn btn-primary px-3 shadow-sm d-flex align-items-center" @click="$emit('open-register')">
            <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-user-plus"></use></svg>
            Регистрация
          </button>
        </div>
      </div>

      <div v-if="isAuthenticated" class="dropdown position-relative me-3">
        <a class="dropdown-toggle d-flex align-items-center text-body text-decoration-none"
           href="#" id="accountDropdown" role="button"
           :aria-expanded="isDropdownOpen ? 'true' : 'false'"
           aria-haspopup="true"
           aria-controls="accountMenu"
           @click.prevent="toggleDropdown">
          <div class="m-2 d-flex align-items-center justify-content-center" aria-hidden="true">
            <svg class="icon icon-lg text-secondary" aria-hidden="true"><use href="#icon-user"></use></svg>
          </div>
          <span class="fw-medium text-body">{{ fullName }}</span>
          <svg class="icon icon-chevron ms-2 text-muted" aria-hidden="true"><use href="#icon-chevron-down"></use></svg>
        </a>
        <ul class="dropdown-menu dropdown-menu-end shadow-lg" id="accountMenu" role="menu" :class="{ 'show': isDropdownOpen }">
          <li role="none">
            <router-link class="dropdown-item fw-semibold py-2" to="/profile" role="menuitem">
              <svg class="icon icon-lg text-primary" aria-hidden="true"><use href="#icon-id-card"></use></svg> Личный кабинет
            </router-link>
          </li>
          <li role="none">
            <router-link class="dropdown-item fw-semibold py-2" to="/teacher-profile" role="menuitem">
              <svg class="icon icon-lg text-primary" aria-hidden="true"><use href="#icon-chalkboard-user"></use></svg>
              Личный кабинет преподавателя
            </router-link>
          </li>
          <li role="none"><hr class="dropdown-divider" role="separator"></li>
          <li role="none"><a class="dropdown-item" href="#" role="menuitem"><svg class="icon icon-lg" aria-hidden="true"><use href="#icon-gear"></use></svg> Настройки</a></li>
          <li role="none"><a class="dropdown-item" href="#" role="menuitem"><svg class="icon icon-lg" aria-hidden="true"><use href="#icon-circle-question"></use></svg> Помощь и поддержка</a></li>
          <li role="none"><a class="dropdown-item" href="#" role="menuitem"><svg class="icon icon-lg" aria-hidden="true"><use href="#icon-bell"></use></svg> Уведомления</a></li>
          <li role="none"><hr class="dropdown-divider" role="separator"></li>
          <li role="none"><a class="dropdown-item text-danger" href="#" role="menuitem" @click.prevent="$emit('logout')"><svg class="icon icon-lg" aria-hidden="true"><use href="#icon-right-from-bracket"></use></svg> Выйти</a></li>
        </ul>
      </div>

      <button class="btn btn-outline-secondary theme-toggle me-3"
              @click="toggleTheme"
              aria-label="Переключить тему"
              :aria-pressed="isDark">
        <svg class="icon icon-sun icon-lg icon-centered" aria-hidden="true"><use href="#icon-sun"></use></svg>
        <svg class="icon icon-moon icon-lg icon-centered" aria-hidden="true"><use href="#icon-moon"></use></svg>
      </button>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'

const { isAuthenticated, fullName } = useAuth()
const { isDark, toggleTheme } = useTheme()

const isDropdownOpen = ref(false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

defineEmits(['open-login', 'open-register', 'logout'])
</script>
