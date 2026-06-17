<template>
  
  <header>
    <nav class="navbar navbar-dark site-navbar" aria-label="Основная навигация">
      <div class="container">
        <router-link
          :to="{ name: 'home' }"
          class="navbar-brand"
          aria-label="Касса.ру — перейти на главную страницу"
        >
          Касса.ру
        </router-link>
        <div class="navbar-actions" aria-label="Авторизация и профиль">
          
          <theme-switcher />

          <template v-if="!isAuthenticated">
            <router-link :to="{ name: 'login' }" class="btn btn-outline-light btn-icon" aria-label="Перейти на страницу входа">
              <base-icon name="login" />
              <span>Вход</span>
            </router-link>
            <router-link :to="{ name: 'register' }" class="btn btn-warning btn-icon" aria-label="Перейти на страницу регистрации">
              <base-icon name="user" />
              <span>Регистрация</span>
            </router-link>
          </template>
          <template v-else>
            <router-link
              :to="{ name: 'profile' }"
              class="btn btn-outline-light btn-icon"
              :aria-label="`Открыть личный кабинет пользователя ${user.name}`"
            >
              <base-icon name="user" />
              <span>{{ user.name }}</span>
            </router-link>
            <button
              type="button"
              class="btn btn-danger btn-icon"
              aria-label="Выйти из аккаунта"
              @click="logout"
            >
              <base-icon name="login" />
              <span>Выйти</span>
            </button>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>

import useAuth from '@/composables/useAuth'
import BaseIcon from '@/components/BaseIcon.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

export default {
  name: 'AppNavbar',
  components: { BaseIcon, ThemeSwitcher },
  setup() {

    const { user, isAuthenticated, logout } = useAuth()
    return { user, isAuthenticated, logout }
  }
}

</script>
