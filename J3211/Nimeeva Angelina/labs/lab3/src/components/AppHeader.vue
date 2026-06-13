<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import { useTheme } from '../composables/useTheme.js'

const router = useRouter()
const route = useRoute()
const { role, logout, cabinetRoute, roleLabel } = useAuth()
const { theme, toggleTheme } = useTheme()

const navLinks = computed(() => {
  if (role.value) {
    return [
      { to: cabinetRoute(), label: 'Кабинет' },
      { to: '/archive', label: 'Архив' },
      { to: '/search', label: 'Помещения' },
    ]
  }
  return [
    { to: '/', label: 'Вход' },
    { to: '/register', label: 'Регистрация' },
    { to: '/search', label: 'Помещения' },
  ]
})

const alertFeed = computed(() => ({
  tenant: [
    { date: '20 марта', text: 'Напоминание о показаниях.' },
    { date: '18 марта', text: 'Срок подписи по допсоглашению скоро истекает.' },
    { date: '12 марта', text: 'Новый счёт и акт уже в архиве.', read: true },
  ],
  admin: [
    { date: '15 марта', text: 'Поступили новые показания по помещениям 3.18 и 2.11.' },
    { date: '14 марта', text: 'Письмо по перепланировке ждёт согласования.' },
    { date: '12 марта', text: 'Счета за март размещены в кабинетах арендаторов.', read: true },
  ],
}[role.value] || []))

const doLogout = () => {
  logout()
  router.push('/')
}
</script>

<template>
  <header class="topbar">
    <div class="container py-3">
      <nav class="navbar navbar-expand-lg p-0">
        <RouterLink class="navbar-brand" to="/">
          <span class="brand-lockup">
            <img class="brand-mark" src="/img/logo_header.svg" alt="Логотип Красной нити" />
            <span class="brand-text">
              <span class="brand-title">Красная нить</span>
              <span class="brand-caption">{{ role ? (role === 'admin' ? 'администрация' : 'арендатор') : 'бизнес-центр' }}</span>
            </span>
          </span>
        </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#siteNav"
          aria-controls="siteNav"
          aria-expanded="false"
          aria-label="Открыть меню"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse mt-3 mt-lg-0" id="siteNav">
          <ul class="navbar-nav ms-auto gap-lg-2 align-items-lg-center">
            <li v-for="link in navLinks" :key="link.to" class="nav-item">
              <RouterLink
                class="nav-link"
                :class="{ active: route.path === link.to }"
                :to="link.to"
              >{{ link.label }}</RouterLink>
            </li>

            <li v-if="role" class="nav-item">
              <button class="btn btn-soft" type="button" @click="doLogout">Выход</button>
            </li>

            <li v-if="role" class="nav-item">
              <button
                class="btn btn-soft notification-trigger"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#appAlerts"
                aria-controls="appAlerts"
              >
                Уведомления
                <span class="notification-badge-dot" aria-hidden="true"></span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>

  <div class="offcanvas offcanvas-end" tabindex="-1" id="appAlerts" aria-labelledby="appAlertsLabel">
    <div class="offcanvas-header">
      <h2 class="offcanvas-title fs-4" id="appAlertsLabel">
        Уведомления{{ role ? ': ' + roleLabel() : '' }}
      </h2>
      <button class="btn-close" type="button" data-bs-dismiss="offcanvas" aria-label="Закрыть"></button>
    </div>
    <div class="offcanvas-body">
      <div class="list-group status-feed">
        <div v-for="(item, i) in alertFeed" :key="i" class="list-group-item">
          <div class="notification-entry" :class="{ 'is-read': item.read }">
            <span class="notification-dot" aria-hidden="true"></span>
            <div>
              <div class="fw-semibold">{{ item.date }}</div>
              <div class="text-body-secondary small">{{ item.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
