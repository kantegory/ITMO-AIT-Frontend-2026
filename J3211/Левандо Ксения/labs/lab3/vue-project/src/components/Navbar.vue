<script setup>
import { useAuth } from "@/composables/useAuth";
import { useTheme } from "@/composables/useTheme";
import { ref, watch, onMounted } from "vue";

const { user, isAuth, organizer, isOrganizer, logout } = useAuth();
const { isDark, toggleTheme } = useTheme();

const themeIcon = ref(isDark.value ? "🌙" : "☀️");
const themeText = ref(isDark.value ? "Dark mode" : "Light mode");

watch(isDark, (val) => {
  themeIcon.value = val ? "🌙" : "☀️";
  themeText.value = val ? "Dark mode" : "Light mode";
});
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">

      <router-link to="/" class="navbar-brand">Ticket-Tac</router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navMenu">

        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/events" class="nav-link">Events</router-link>
          </li>
        </ul>

        <!-- Theme toggle -->
        <button @click="toggleTheme" class="theme-switch-alt me-3">
          <div class="theme-switch-alt-container">
            <div class="theme-switch-alt-icons">
              <span class="theme-icon-sun">☀️</span>
              <span class="theme-icon-moon">🌙</span>
            </div>
            <div class="theme-switch-alt-track">
              <div class="theme-switch-alt-thumb">
                <span class="theme-icon-active">{{ themeIcon }}</span>
              </div>
            </div>
          </div>
          <span class="theme-text-alt">{{ themeText }}</span>
        </button>

        <!-- Auth / Organizer -->
        <div class="d-flex">
          <template v-if="isOrganizer">
            <span class="text-light me-3 mt-2">{{ organizer?.name }}</span>
            <router-link to="/organizer-dashboard" class="btn btn-outline-light me-3">Dashboard</router-link>
            <button class="btn btn-outline-warning" @click="logout">Logout</button>
          </template>

          <template v-else-if="isAuth">
            <span class="text-light me-3 mt-2">{{ user?.name }}</span>
            <router-link to="/dashboard" class="btn btn-outline-light me-3">Profile</router-link>
            <button class="btn btn-outline-warning" @click="logout">Logout</button>
          </template>

          <template v-else>
            <router-link to="/login" class="btn btn-outline-light me-3">Login</router-link>
            <router-link to="/register" class="btn btn-warning">Register</router-link>
          </template>
        </div>

      </div>
    </div>
  </nav>
</template>