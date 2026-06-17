<script setup>
import { useAuthStore } from '@/stores/auth';
import VIcon from '@/components/VIcon.vue';

const authStore = useAuthStore();
</script>

<template>
  <div class="app-layout d-flex min-vh-100">
    <aside>
      <button class="btn btn-primary d-md-none d-flex align-items-center justify-content-center m-3" 
              type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar" 
              style="width: 45px; height: 45px; position: fixed; z-index: 1040;"> 
        <VIcon name="icon-home" />
      </button>

      <nav class="d-none d-md-flex flex-column flex-shrink-0 p-4 bg-body-tertiary border-end h-100 position-sticky top-0" 
           style="width:260px;" aria-label="Main sidebar">
        
        <router-link to="/dashboard" class="d-flex align-items-center mb-4 text-decoration-none gap-2 text-body-emphasis">
          <VIcon name="icon-logo-pipes" width="32" height="32" />
          <span class="fs-4 fw-bold">Pipes</span> 
        </router-link>

        <ul class="nav nav-pills flex-column mb-auto gap-1">
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link text-body-emphasis d-flex align-items-center gap-2" active-class="active text-white">
              <VIcon name="icon-grid" width="18" height="18" /> Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/experiments" class="nav-link text-body-emphasis d-flex align-items-center gap-2" active-class="active text-white">
              <VIcon name="icon-flask" width="18" height="18" /> Experiments
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/modelss" class="nav-link text-body-emphasis d-flex align-items-center gap-2" active-class="active text-white">
              <VIcon name="icon-layers" width="18" height="18" /> Model Registry
            </router-link>
          </li>
        </ul>

        <div class="mt-auto">
          <hr>
          <div class="dropdown">
            <a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://github.com/mdo.png" width="32" height="32" class="rounded-circle me-2" alt="User avatar">
              <strong>{{ authStore.user?.username }}</strong>
            </a>
            <ul class="dropdown-menu text-small shadow">
              <li><a class="dropdown-item" href="#">Settings</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item text-danger" @click="authStore.logout">Sign out</button></li>
            </ul>
          </div>
        </div>
      </nav>
    </aside>

    <main class="flex-grow-1 p-4 bg-body">
      <slot />
    </main>
  </div>
</template>