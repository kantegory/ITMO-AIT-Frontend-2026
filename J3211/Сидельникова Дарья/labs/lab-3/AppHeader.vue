<script setup>
defineProps({
  title: {
    type: String,
    default: 'PRIME'
  }
})
</script>

<template>
  <nav class="navbar navbar-expand-lg shadow-sm px-4">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold logo text-white text-decoration-none" to="/dashboard">
        {{ title }}
      </router-link>
    </div>
  </nav>
</template>