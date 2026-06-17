<template>
  <header class="app-header">
    <router-link to="/" class="logo">
      <img src="@/images/logo.png" alt="Логотип"/>
    </router-link>

    <form v-if="showSearch" class="d-none d-md-flex me-3" style="width:260px"
          @submit.prevent="onSearch">
      <input
        v-model="searchQuery"
        type="search"
        class="form-control search-input"
        placeholder="Поиск курсов..."
      />
    </form>

    <button class="btn btn-outline-light theme-toggle me-2" @click="toggleTheme"
            :aria-label="isDark ? 'Светлая тема' : 'Тёмная тема'">
      <span class="icon-sun">
        <svg class="icon"><use href="#icon-sun-fill"></use></svg>
      </span>
      <span class="icon-moon">
        <svg class="icon"><use href="#icon-moon-fill"></use></svg>
      </span>
    </button>

    <template v-if="!auth.isLoggedIn">
      <router-link to="/sign-in" class="btn btn-outline-light me-2">Войти</router-link>
      <router-link to="/register" class="btn btn-warning">Регистрация</router-link>
    </template>

    <template v-else>
      <template v-if="isHome || isCoursePlayer">
        <router-link
          :to="auth.isTeacher ? '/teacher' : '/cabinet'"
          class="btn btn-outline-light d-flex align-items-center gap-2 me-2"
        >
          <svg class="icon">
            <use href="#icon-person-circle"></use>
          </svg>
          <span class="d-none d-md-inline">Кабинет</span>
        </router-link>
      </template>
      <template v-else>
        <router-link to="/" class="btn btn-outline-light me-2">
          <svg class="icon me-1">
            <use href="#icon-house"></use>
          </svg>
          <span class="d-none d-md-inline">На главную</span>
        </router-link>
      </template>

      <button class="btn btn-warning" @click="onLogout">Sign out</button>
    </template>
  </header>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useAuthStore} from '@/stores/auth'

defineProps({
  showSearch: {type: Boolean, default: false},
})

const emit = defineEmits(['search'])

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const isDark = ref(false)

const isHome = computed(() => route.path === '/')
const isCoursePlayer = computed(() => route.name === 'course-player')

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
})

function onSearch() {
  emit('search', searchQuery.value.trim())
}

function onLogout() {
  auth.logout()
  router.push('/')
}
</script>
