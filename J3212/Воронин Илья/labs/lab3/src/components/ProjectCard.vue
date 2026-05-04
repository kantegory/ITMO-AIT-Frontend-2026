<script setup>
defineProps({
  project: { type: Object, required: true },
});
</script>

<template>
  <div class="col-md-6 col-lg-4">
    <div class="card card-body task-card h-100">
      <h5 class="card-title">
        <RouterLink
          :to="{ name: 'project', params: { id: project.id } }"
          class="text-decoration-none text-dark"
        >{{ project.name }}</RouterLink>
      </h5>
      <p class="card-text small text-muted mb-0">{{ project.description || '' }}</p>
    </div>
  </div>
</template>
