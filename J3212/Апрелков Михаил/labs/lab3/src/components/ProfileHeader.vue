<template>
  <header
    class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4"
  >
    <div class="d-flex align-items-center mb-3 mb-md-0">
      <div class="avatar-placeholder me-3">
        <i class="bi bi-person"></i>
      </div>
      <div>
        <h1 class="h4 mb-1">Привет{{ user ? ", " + user.name : "" }}!</h1>
        <p class="text-muted-sm mb-0">
          Ваши сохранённые маршруты, заметки и предстоящие поездки.
        </p>
      </div>
    </div>
    <p class="text-muted-sm mb-0 profile-email-line" v-if="user">
      <i class="bi bi-envelope me-1"></i> {{ user.email }}
    </p>
  </header>
</template>

<script setup>
defineProps({
  user: { type: Object, default: null }
});
</script>
