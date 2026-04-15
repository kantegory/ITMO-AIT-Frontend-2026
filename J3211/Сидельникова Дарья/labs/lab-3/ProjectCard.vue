<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="col-md-4 mb-3">
    <router-link :to="`/project/${project.id}`" class="text-decoration-none text-dark">
      <div class="card project-card h-100">
        <div class="card-body">
          <h5 class="card-title">{{ project.name }}</h5>
          <p class="card-text text-muted mb-1">Owner: {{ project.ownerName || '-' }}</p>
          <p class="card-text text-muted">{{ project.description || '' }}</p>
        </div>
      </div>
    </router-link>
  </div>
</template>