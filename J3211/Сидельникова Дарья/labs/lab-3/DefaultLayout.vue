<script setup>
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="dashboard-page">
    <div class="d-flex">
      <AppSidebar />

      <div class="flex-grow-1">
        <AppHeader />
        <main class="p-4">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>