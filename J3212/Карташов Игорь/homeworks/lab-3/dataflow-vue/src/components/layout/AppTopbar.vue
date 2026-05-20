<script setup>
import { RouterLink } from 'vue-router'
import ThemeToggle from '../ThemeToggle.vue'

defineProps({
  title: { type: String, default: '' },
  breadcrumb: { type: String, default: '' },
  showProfileLink: { type: Boolean, default: true },
  showLogout: { type: Boolean, default: false },
})

defineEmits(['logout'])
</script>

<template>
  <div class="topbar">
    <div>
      <template v-if="breadcrumb">
        <RouterLink :to="{ name: 'pipelines' }" class="text-decoration-none text-brand">Pipelines</RouterLink>
        <span class="text-muted"> / </span>
        <strong>{{ breadcrumb }}</strong>
      </template>
      <strong v-else class="text-brand">{{ title }}</strong>
    </div>
    <div class="d-flex align-items-center gap-2">
      <ThemeToggle />
      <a
        v-if="showLogout"
        href="#"
        class="text-decoration-none text-danger"
        @click.prevent="$emit('logout')"
      >
        <i class="bi bi-box-arrow-right"></i> Sign Out
      </a>
      <RouterLink
        v-else-if="showProfileLink"
        :to="{ name: 'profile' }"
        class="text-decoration-none text-dark"
      >
        <i class="bi bi-person-circle"></i> Profile
      </RouterLink>
    </div>
  </div>
</template>
