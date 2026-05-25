<script setup lang="ts">
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';

defineProps<{ title?: string }>();
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="main-content">
      <AppTopbar :title="title">
        <template #left v-if="$slots['topbar-left']">
          <slot name="topbar-left" />
        </template>
      </AppTopbar>
      <slot />
    </div>
  </div>
</template>
