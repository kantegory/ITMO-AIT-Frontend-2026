<template>
  <a class="skip-link btn btn-light border" href="#mainContent">Перейти к основному контенту</a>

  <div class="app-layout d-flex">
    <SidebarNav @logout="handleLogout" />
    <div class="app-main flex-grow-1">
      <TopBar :title="title">
        <template v-if="$slots.topbar">
          <slot name="topbar" />
        </template>
      </TopBar>
      <main id="mainContent" class="app-page p-3 p-md-4" tabindex="-1">
        <slot />
      </main>
    </div>
  </div>

  <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileMenu" aria-label="Мобильная навигация">
    <header class="offcanvas-header">
      <h2 class="offcanvas-title h5 mb-0">FlowOrchestrator</h2>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Закрыть меню"></button>
    </header>
    <div class="offcanvas-body">
      <nav class="nav nav-pills flex-column gap-1" aria-label="Разделы приложения, мобильная навигация">
        <RouterLink class="nav-link" to="/dashboard">Dashboard</RouterLink>
        <RouterLink class="nav-link" to="/pipelines">Pipelines</RouterLink>
        <RouterLink class="nav-link" to="/monitoring">Monitoring</RouterLink>
        <button class="nav-link text-danger text-start" type="button" @click="handleLogout">
          <IconSprite class="me-1" name="icon-logout" size="sm" />
          <span>Выйти</span>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import IconSprite from './IconSprite.vue';
import SidebarNav from './SidebarNav.vue';
import TopBar from './TopBar.vue';
import { useAuth } from '../composables/useAuth';

defineProps({
  title: {
    type: String,
    required: true
  }
});

const router = useRouter();
const { logout } = useAuth();

const handleLogout = () => {
  if (!window.confirm('Выйти из аккаунта?')) return;
  logout();
  router.push('/');
};
</script>
