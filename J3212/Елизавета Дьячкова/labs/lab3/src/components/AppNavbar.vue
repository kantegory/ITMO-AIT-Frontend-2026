<template>
  <header class="navbar navbar-expand-lg bg-white border-bottom">
    <div class="container">
      <RouterLink
        class="navbar-brand fw-semibold d-inline-flex align-items-center gap-2"
        :to="{ name: 'home' }"
        aria-label="TicketHub — на главную"
      >
        <svg class="sprite-icon sprite-icon--brand" width="22" height="22" aria-hidden="true" focusable="false">
          <use href="#icon-ticket" />
        </svg>
        <span>TicketHub</span>
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="Переключить меню"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <nav class="collapse navbar-collapse" id="mainNav" aria-label="Основная навигация">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink
              class="nav-link d-inline-flex align-items-center gap-2"
              active-class="active"
              :to="{ name: 'home' }"
            >
              <svg class="sprite-icon" width="18" height="18" aria-hidden="true" focusable="false">
                <use href="#icon-calendar" />
              </svg>
              <span>Мероприятия</span>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link d-inline-flex align-items-center gap-2"
              active-class="active"
              :to="{ name: 'organizer' }"
            >
              <svg class="sprite-icon" width="18" height="18" aria-hidden="true" focusable="false">
                <use href="#icon-building" />
              </svg>
              <span>Кабинет организатора</span>
            </RouterLink>
          </li>
        </ul>
        <ThemeSelect />
        <div class="d-flex gap-2">
          <template v-if="!isLoggedIn">
            <RouterLink
              class="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
              active-class="active"
              :to="{ name: 'login' }"
            >
              <svg class="sprite-icon sprite-icon--btn" width="16" height="16" aria-hidden="true" focusable="false">
                <use href="#icon-user" />
              </svg>
              Вход
            </RouterLink>
            <RouterLink
              class="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
              active-class="active"
              :to="{ name: 'register' }"
            >
              <svg class="sprite-icon sprite-icon--btn" width="16" height="16" aria-hidden="true" focusable="false">
                <use href="#icon-ticket" />
              </svg>
              Регистрация
            </RouterLink>
          </template>
          <RouterLink
            v-else
            class="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
            active-class="active"
            :to="{ name: 'profile' }"
          >
            <svg class="sprite-icon sprite-icon--btn" width="16" height="16" aria-hidden="true" focusable="false">
              <use href="#icon-user" />
            </svg>
            Личный кабинет
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import ThemeSelect from '@/components/ThemeSelect.vue'
import { useAuth } from '@/composables/useAuth'

const { isLoggedIn } = useAuth()
</script>
