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
  {to: '/teacher', icon: 'icon-book', label: 'Мои курсы'},
  {to: '/teacher/add', icon: 'icon-plus-lg', label: 'Создать курс'},
]

function isExactActive(to) {
  return route.path === to || (to === '/teacher' && route.path.startsWith('/teacher/edit'))
}

function onLogout() {
  auth.logout()
  router.push('/')
}
</script>
