<script setup>
defineProps({
  user: { type: Object, required: true },
})

const initials = (user) => `${(user.firstName || '').charAt(0)}${(user.lastName || '').charAt(0)}`
</script>

<template>
  <div class="bg-card rounded shadow-sm p-4 text-center">
    <div class="avatar-circle mx-auto mb-3">
      <span class="text-white fs-4 fw-bold">{{ initials(user) }}</span>
    </div>
    <h5>{{ user.firstName }} {{ user.lastName }}</h5>
    <p class="text-muted">{{ user.email }}</p>
    <span class="badge bg-primary">{{ user.role }}</span>

    <hr />

    <div class="text-start">
      <p class="mb-1"><strong>Team:</strong> {{ user.team || '—' }}</p>
      <p class="mb-1"><strong>Timezone:</strong> {{ user.timezone || '—' }}</p>
      <p class="mb-1"><strong>Member since:</strong> {{ user.memberSince || '—' }}</p>
      <p class="mb-0">
        <a href="#" class="text-decoration-none text-brand">
          <svg class="svg-icon"><use href="/icons.svg#icon-bluesky"></use></svg> Bluesky
        </a>
      </p>
    </div>
  </div>
</template>
