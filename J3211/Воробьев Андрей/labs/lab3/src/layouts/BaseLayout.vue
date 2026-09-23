<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import PreloginNavbar from '@/components/PreloginNavbar.vue'
import PostloginNavbar from '@/components/PostloginNavbar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import AppModal from '@/components/AppModal.vue'

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const isGuestPage = computed(() => route.meta.guestOnly)

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <PreloginNavbar v-if="isGuestPage || !authStore.isAuthenticated" />
  <PostloginNavbar v-else />

  <slot />

  <SiteFooter />
  <AppModal />
</template>
