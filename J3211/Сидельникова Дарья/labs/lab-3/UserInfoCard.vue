<script setup>
defineProps({
  user: {
    type: Object,
    default: null
  }
})
</script>

<template>
  <div v-if="user" class="card p-3 mb-4 profile-card">
    <div>
      <h5 class="mb-1">{{ user.name }}</h5>
      <p class="mb-0 text-muted">{{ user.email }}</p>
    </div>
  </div>
</template>