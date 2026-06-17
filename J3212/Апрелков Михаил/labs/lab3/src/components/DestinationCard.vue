<template>
  <div class="col-md-6 col-lg-4">
    <div class="card tripatropa-card h-100">
      <img :src="destination.image" :alt="destination.title" class="card-img-top" />
      <div class="card-body">
        <h5 class="card-title mb-1">{{ destination.title }}</h5>
        <p class="card-text text-muted-sm mb-2">{{ destination.description }}</p>
        <div class="mb-3 d-flex flex-wrap gap-2">
          <span class="badge bg-primary-subtle text-primary">
            <i class="bi bi-buildings me-1"></i> {{ typeLabel(destination.type) }}
          </span>
          <span class="badge bg-success-subtle text-success">
            {{ destination.durationDays }} дня
          </span>
          <span class="badge bg-secondary-subtle text-secondary">
            {{ formatBudget(destination.budget) }} ₽
          </span>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-auto">
          <RouterLink
            :to="`/destinations/${destination.id}`"
            class="btn btn-outline-primary btn-sm"
            >Открыть</RouterLink
          >
          <button
            type="button"
            class="btn btn-sm"
            :class="saved ? 'btn-success' : 'btn-outline-secondary'"
            @click="$emit('toggle-save', destination)"
          >
            {{ saved ? "Сохранено" : "Сохранить" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { typeLabel, formatBudget } from "../composables/useDestinations.js";

defineProps({
  destination: { type: Object, required: true },
  saved: { type: Boolean, default: false }
});
defineEmits(["toggle-save"]);
</script>
