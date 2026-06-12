<template>
  <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">MAX афиша</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navContent">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item"><router-link class="nav-link" to="/">Главная</router-link></li>
          <li v-if="!isAuthenticated" class="nav-item"><router-link class="nav-link" to="/login">Вход</router-link></li>
          <li v-if="!isAuthenticated" class="nav-item"><router-link class="nav-link" to="/register">Регистрация</router-link></li>
          <li v-if="isAuthenticated" class="nav-item"><router-link class="nav-link" to="/profile">Личный кабинет</router-link></li>
          <li v-if="isOrganizer" class="nav-item"><router-link class="nav-link" to="/organizer">Организатору</router-link></li>
          <li v-if="isAuthenticated" class="nav-item"><button class="nav-link btn btn-link text-decoration-none" @click="logout">Выйти</button></li>
          <li class="nav-item ms-2">
            <li class="nav-item ms-2">
              <button class="btn btn-outline-light theme-switch" @click="$emit('toggle-theme')">
                <Icon :name="isDark ? 'sun' : 'moon'" size="16" />
                {{ isDark ? 'Светлая' : 'Тёмная' }} тема
              </button>
            </li>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import Icon from '@/components/ui/Icon.vue'

defineProps({ isDark: Boolean })
defineEmits(['toggle-theme'])

const { isAuthenticated, hasRole, logout } = useAuth()
const isOrganizer = computed(() => hasRole('organizer'))
</script>