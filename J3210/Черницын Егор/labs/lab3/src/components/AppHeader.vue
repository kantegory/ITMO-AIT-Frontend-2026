<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import ThemeToggle from '@/components/ThemeToggle.vue'

defineProps({
  active: {
    type: String,
    default: 'dashboard',
  },
  navClass: {
    type: String,
    default: 'navbar navbar-expand-lg shadow-sm',
  },
})

const router = useRouter()
const { logout } = useAuth()
</script>

<template>
  <header>
    <nav :class="navClass">
      <div class="container">
        <a
          class="navbar-brand text-custom fw-bold d-flex align-items-center gap-2"
          href="dash.html"
          @click.prevent="router.push({ name: 'dashboard' })"
        >
          <img class="nav-logo" src="/imgs/1.png" alt="Логотип MFF" width="35" />
          <span class="fs-3 fw-bolder">MFF</span>
          <img class="nav-logo" src="/imgs/2.png" alt="Логотип MFF" width="35" />
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="navbarNav" class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: active === 'dashboard' }"
                href="dash.html"
                @click.prevent="router.push({ name: 'dashboard' })"
              >
                Главная
              </a>
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: active === 'transactions' }"
                href="transact.html"
                @click.prevent="router.push({ name: 'transactions' })"
              >
                Транзакции
              </a>
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: active === 'accounts' }"
                href="accounts.html"
                @click.prevent="router.push({ name: 'accounts' })"
              >
                Счета
              </a>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-3">
            <ThemeToggle />

            <a href="login.html" class="btn btn-outline-custom btn-sm" @click.prevent="logout">
              Выйти
            </a>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
