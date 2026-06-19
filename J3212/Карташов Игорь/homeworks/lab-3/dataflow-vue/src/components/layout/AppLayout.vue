<script setup>
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
import { useAuth } from '../../composables/useAuth'

defineProps({
  title: { type: String, default: '' },
  breadcrumb: { type: String, default: '' },
  showProfileLink: { type: Boolean, default: true },
  showLogout: { type: Boolean, default: false },
})

const { logout } = useAuth()
</script>

<template>
  <AppSidebar />
  <AppTopbar
    :title="title"
    :breadcrumb="breadcrumb"
    :show-profile-link="showProfileLink"
    :show-logout="showLogout"
    @logout="logout"
  />
  <main class="main-content">
    <slot />
  </main>
</template>
