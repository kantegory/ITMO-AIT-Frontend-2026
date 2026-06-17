<template>
  <header class="border-bottom bg-white">
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <RouterLink class="navbar-brand fw-semibold" to="/">
          Travel Planner
        </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Переключить навигацию"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="mainNav" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto align-items-lg-center">
            <li class="nav-item me-lg-2 mt-2 mt-lg-0">
              <button
                class="theme-toggle"
                type="button"
                :aria-label="themeButtonLabel"
                @click="toggleTheme"
              >
                <span>{{ theme === 'dark' ? 'Светлая тема' : 'Тёмная тема' }}</span>
              </button>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" to="/search">
                Поиск
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" to="/collaboration">
                Совместно
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" to="/profile">
                Кабинет
              </RouterLink>
            </li>

            <li v-if="!currentUser" class="nav-item">
              <RouterLink class="nav-link" to="/login">
                Вход
              </RouterLink>
            </li>

            <li v-if="!currentUser" class="nav-item">
              <RouterLink class="nav-link" to="/register">
                Регистрация
              </RouterLink>
            </li>

            <li v-if="currentUser" class="nav-item dropdown">
              <a
                id="authMenuLink"
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ currentUser.name }}
              </a>

              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="authMenuLink">
                <li>
                  <RouterLink class="dropdown-item" to="/profile">
                    Личный кабинет
                  </RouterLink>
                </li>

                <li>
                  <button class="dropdown-item" type="button" @click="handleLogout">
                    Выйти
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'

const router = useRouter()

const { theme, toggleTheme } = useTheme()
const { currentUser, logout } = useAuth()

const themeButtonLabel = computed(() =>
  theme.value === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему',
)

function handleLogout() {
  logout()
  router.push('/login')
}
</script>