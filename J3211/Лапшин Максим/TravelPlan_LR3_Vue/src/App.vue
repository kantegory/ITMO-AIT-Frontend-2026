<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import SvgIcons from '@/components/SvgIcons.vue'

const route = useRoute()
const isAuthPage = computed(() => ['login', 'register'].includes(route.name))
</script>

<template>
  <SvgIcons />
  <div v-if="!isAuthPage" class="app-layout">
    <AppSidebar />
    <main id="main-content" class="main-content p-4" role="main">
      <RouterView />
    </main>
  </div>
  <main v-else class="auth-layout">
    <RouterView />
  </main>
</template>
