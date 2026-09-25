<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-white shadow-sm" aria-label="Основная навигация">
      <div class="container">
        <router-link class="navbar-brand" :to="{ name: 'home' }">EventTix</router-link>

        <button
          class="navbar-toggler"
          type="button"
          aria-controls="mainNav"
          :aria-expanded="isNavOpen"
          aria-label="Открыть меню"
          @click="isNavOpen = !isNavOpen"
        >
          <span class="navbar-toggler-icon" />
        </button>

        <div id="mainNav" class="collapse navbar-collapse" :class="{ show: isNavOpen }">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'home' }">Главная</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'events' }">Мероприятия</router-link>
            </li>
          </ul>

          <theme-toggle class="me-2" />

          <template v-if="!isAuthenticated">
            <div class="d-flex gap-2">
              <router-link class="btn btn-outline-secondary" :to="{ name: 'login' }">Войти</router-link>
              <router-link class="btn btn-brand" :to="{ name: 'register' }">Регистрация</router-link>
            </div>
          </template>

          <template v-else>
            <div class="d-flex flex-wrap gap-2 align-items-center">
              <router-link class="btn btn-outline-secondary" :to="{ name: 'profile' }">
                <icon-component name="user" /> {{ user.name }}
              </router-link>
              <router-link v-if="isOrganizer" class="btn btn-outline-secondary" :to="{ name: 'organizer' }">
                Кабинет организатора
              </router-link>
              <button type="button" class="btn btn-link text-decoration-none" @click="onLogout">Выйти</button>
            </div>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapState } from 'pinia'

import ThemeToggle from '@/components/common/ThemeToggle.vue'
import IconComponent from '@/components/common/IconComponent.vue'
import useAuthStore from '@/stores/auth'

export default {
  name: 'HeaderComponent',
  components: { ThemeToggle, IconComponent },

  data() {
    return {
      isNavOpen: false,
    }
  },

  computed: {
    ...mapState(useAuthStore, ['user', 'isAuthenticated', 'isOrganizer']),
  },

  watch: {
    // на телефоне меню закрывается само после перехода
    $route() {
      this.isNavOpen = false
    },
  },

  methods: {
    ...mapActions(useAuthStore, ['logout']),

    onLogout() {
      this.logout()
      this.$router.push({ name: 'login' })
    },
  },
}
</script>
