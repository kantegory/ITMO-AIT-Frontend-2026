<template>
  <div>
    <AppHeader/>
    <div class="cabinet-layout">
      <aside class="cabinet-sidebar">
        <div class="sidebar-user">
          <img src="@/images/jinx.png" alt="Аватар"/>
          <div>
            <div class="user-name">{{ auth.user?.name }}</div>
            <div class="user-email">{{ auth.user?.email }}</div>
          </div>
        </div>
        <ul class="sidebar-nav">
          <li v-for="link in navLinks" :key="link.to">
            <router-link
              :to="link.to"
              :class="{ active: isExactActive(link.to) }"
            >
              <svg class="icon">
                <use :href="`#${link.icon}`"></use>
              </svg>
              {{ link.label }}
            </router-link>
          </li>
          <li class="sidebar-divider"></li>
          <li>
            <a href="#" @click.prevent="onLogout">
              <svg class="icon">
                <use href="#icon-box-arrow-left"></use>
              </svg>
              Выйти
            </a>
          </li>
        </ul>
      </aside>
      <main class="cabinet-main">
        <router-view/>
      </main>
    </div>
  </div>
</template>

<script setup>
import {useRouter, useRoute} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const navLinks = [
  {to: '/cabinet', icon: 'icon-speedometer', label: 'Обзор'},
  {to: '/cabinet/courses', icon: 'icon-book', label: 'Мои курсы'},
  {to: '/cabinet/favorites', icon: 'icon-heart', label: 'Избранное'},
  {to: '/cabinet/certificates', icon: 'icon-award', label: 'Сертификаты'},
]

function isExactActive(to) {
  return route.path === to
}

function onLogout() {
  auth.logout()
  router.push('/')
}
</script>
