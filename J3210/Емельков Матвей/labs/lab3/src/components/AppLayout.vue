<template>
  <div class="app-layout">
    <AppSidebar @open-settings="showSettings = true" />
    <main class="main-content">
      <slot />
    </main>
  </div>

  <SettingsModal :show="showSettings" @close="showSettings = false" />
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import SettingsModal from './SettingsModal.vue'

const showSettings = ref(false)
</script>
