<script setup>
import VIcon from '@/components/VIcon.vue';
import LoginModal from '@/components/auth/LoginModal.vue';
import SignupModal from '@/components/auth/SignupModal.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const onLogin = async (data) => {
  await authStore.login(data);
};

const onSignup = async (data) => {
  await authStore.signup(data);
};
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <header>
      <nav class="navbar bg-body-tertiary" aria-label="Main navigation">
        <div class="container-fluid">
          <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
            <VIcon name="icon-logo-pipes" width="40" height="40" />
            <span class="fw-bold">Pipes</span>
          </router-link>

          <div class="d-flex align-items-center">
            <template v-if="!authStore.isAuthenticated">
              <button 
                class="btn btn-outline-primary me-2" 
                data-bs-toggle="modal" 
                data-bs-target="#loginModal"
              >
                Log in
              </button>
              <button 
                class="btn btn-primary" 
                data-bs-toggle="modal" 
                data-bs-target="#signupModal"
              >
                Sign up
              </button>
            </template>

            <template v-else>
              <router-link to="/dashboard" class="btn btn-outline-secondary me-2">
                Dashboard
              </router-link>
              <span class="me-3 d-none d-sm-inline">
                {{ authStore.user?.username }}
              </span>
              <button class="btn btn-danger" @click="authStore.logout">
                Logout
              </button>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-grow-1">
      <slot />
    </main>

    <LoginModal @submit="onLogin" />
    <SignupModal @submit="onSignup" />

    <footer class="bg-body-tertiary py-3 mt-auto">
      <nav aria-label="Footer navigation">
        <ul class="nav justify-content-center border-bottom pb-3 mb-3"> 
            <li class="nav-item"><router-link to="/" class="nav-link px-2 text-body-secondary">Home</router-link></li> 
            <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary">Features</a></li> 
            <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary">FAQs</a></li> 
            <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary">About</a></li> 
        </ul> 
      </nav>
      <p class="text-center text-body-secondary">© 2026 Company, Inc</p> 
    </footer>
  </div>
</template>