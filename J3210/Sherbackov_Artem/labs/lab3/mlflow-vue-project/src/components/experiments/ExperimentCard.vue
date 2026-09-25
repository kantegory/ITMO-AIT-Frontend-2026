<script setup>
import { useDate } from '@/composables/useDate';
const { formatDate } = useDate();

defineProps({
  experiment: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="col">
    <router-link :to="`/experiments/${experiment.id}`" class="text-decoration-none text-dark">
      <div class="card h-100 shadow-sm card-hover">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title fw-bold mb-0">{{ experiment.name }}</h5>
          </div>
          <p class="card-text text-muted mb-3">Model: {{ experiment.model }}</p>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <small class="text-body-secondary">
              {{ formatDate(experiment.createdAt) }}
            </small>
            <span class="text-primary">&rarr;</span>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>