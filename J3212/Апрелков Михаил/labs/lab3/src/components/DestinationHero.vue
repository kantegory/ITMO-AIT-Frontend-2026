<template>
  <section class="bg-dark text-white">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-7 py-4">
          <h1 class="h3 mb-2">{{ destination.title }}</h1>
          <p class="mb-3 text-light">{{ destination.description }}</p>
          <div class="d-flex flex-wrap gap-2 mb-3">
            <span class="badge bg-light text-dark">
              <i class="bi bi-buildings me-1"></i> {{ typeLabel(destination.type) }}
            </span>
            <span class="badge bg-light text-dark">
              <i class="bi bi-clock me-1"></i> {{ destination.durationDays }} дня
            </span>
            <span class="badge bg-light text-dark">
              <i class="bi bi-currency-ruble me-1"></i>
              ~{{ formatBudget(destination.budget) }} ₽
            </span>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <RouterLink to="/profile" class="btn btn-outline-light btn-sm">
              В профиль
            </RouterLink>
          </div>
        </div>
        <div class="col-lg-5 d-none d-lg-block">
          <img
            :src="destination.image"
            :alt="destination.title"
            class="img-fluid rounded-4 my-3"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { typeLabel, formatBudget } from "../composables/useDestinations.js";

defineProps({
  destination: { type: Object, required: true }
});
</script>
