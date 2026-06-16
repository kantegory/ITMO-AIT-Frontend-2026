<script setup>
import { RouterLink } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import ThemeToggle from './ThemeToggle.vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Task Search'
  }
});

const { currentUser, logout } = useAuth();
</script>

<template>
  <header>
    <nav class="navbar bg-body-tertiary border-bottom" aria-label="Основная навигация">
      <div class="container-fluid gap-3 flex-wrap">
        <div class="d-flex align-items-center gap-2">
          <img src="/public/logo.png" alt="Логотип Task Search" id="logo-acc" />
          <RouterLink class="navbar-brand mb-0" :to="{ name: 'tasks' }">{{ props.title }}</RouterLink>
        </div>

        <ul class="navbar-nav flex-row flex-wrap gap-3 me-auto mb-0">
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'tasks' }" active-class="active">
              Список задач
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'account' }" active-class="active">
              Личный кабинет
            </RouterLink>
          </li>
        </ul>

        <div class="d-flex flex-wrap align-items-center gap-2 ms-lg-3">
          <span v-if="currentUser" class="small text-muted">
            {{ currentUser.name }} {{ currentUser.surname }}
          </span>
          <ThemeToggle />
          <button class="btn btn-outline-danger btn-sm" type="button" @click="logout">
            Выйти
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>
