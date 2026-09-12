<template>
  <div class="col-md-6 col-lg-4 mb-4">
    <div class="card h-100 hover-lift">
      <div class="card-body">
        <h5 class="card-title">{{ title }}</h5>
        <p class="card-text">{{ description }}</p>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <small class="text-muted">⏱ {{ duration }}</small>
          <span class="badge bg-secondary">{{ category }}</span>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ title: String, description: String, duration: String, category: String })
</script>