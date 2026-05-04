<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useI18n } from '../composables/useI18n';

const { user, isAuthenticated, logout } = useAuth();
const { t, setLang, lang } = useI18n();
const router = useRouter();

function onLogout() {
  logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <RouterLink class="navbar-brand" :to="{ name: 'home' }">ProjectHub</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Меню"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul v-if="!isAuthenticated" class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'home' }" active-class="active">
              {{ t('nav_home') }}
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'login' }" active-class="active">
              {{ t('nav_login') }}
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'register' }" active-class="active">
              {{ t('nav_register') }}
            </RouterLink>
          </li>
          <li class="nav-item ms-2">
            <span class="navbar-text small">
              <a
                href="#"
                class="text-white text-decoration-none"
                :class="{ 'fw-bold': lang === 'ru' }"
                @click.prevent="setLang('ru')"
              >RU</a>
              <span class="mx-1">|</span>
              <a
                href="#"
                class="text-white text-decoration-none"
                :class="{ 'fw-bold': lang === 'en' }"
                @click.prevent="setLang('en')"
              >EN</a>
            </span>
          </li>
        </ul>

        <template v-else>
          <ul class="navbar-nav me-auto align-items-center">
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'dashboard' }" active-class="active">
                {{ t('nav_dashboard') }}
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'search' }" active-class="active">
                {{ t('nav_search') }}
              </RouterLink>
            </li>
            <li class="nav-item ms-2">
              <span class="navbar-text small">
                <a
                  href="#"
                  class="text-white text-decoration-none"
                  :class="{ 'fw-bold': lang === 'ru' }"
                  @click.prevent="setLang('ru')"
                >RU</a>
                <span class="mx-1">|</span>
                <a
                  href="#"
                  class="text-white text-decoration-none"
                  :class="{ 'fw-bold': lang === 'en' }"
                  @click.prevent="setLang('en')"
                >EN</a>
              </span>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >{{ user?.name || t('user_default') }}</a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <RouterLink class="dropdown-item" :to="{ name: 'dashboard' }">
                    {{ t('nav_cabinet') }}
                  </RouterLink>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="onLogout">
                    {{ t('nav_logout') }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </nav>
</template>
