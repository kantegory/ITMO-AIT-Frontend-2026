<template>
  <section class="card tripatropa-card mb-4" aria-labelledby="saved-routes-title">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0" id="saved-routes-title">Сохранённые маршруты</h2>
        <RouterLink to="/search" class="btn btn-sm btn-outline-primary">
          <i class="bi bi-search me-1"></i> Найти новые
        </RouterLink>
      </div>
      <div class="row g-3">
        <div v-if="!destinations.length" class="col-12">
          <div class="text-muted-sm">Сохранённых маршрутов пока нет.</div>
        </div>
        <div
          v-for="d in destinations"
          :key="d.id"
          class="col-md-6"
        >
          <article class="card h-100 border-0 bg-light">
            <div class="card-body">
              <h5 class="card-title mb-1">{{ d.title }}</h5>
              <p class="text-muted-sm mb-2">
                {{ d.durationDays }} дня • {{ typeLabel(d.type).toLowerCase() }}
              </p>
              <div class="mb-2 d-flex flex-wrap gap-2">
                <span class="badge bg-primary-subtle text-primary">
                  {{ typeLabel(d.type) }}
                </span>
                <span class="badge bg-secondary-subtle text-secondary">
                  {{ formatBudget(d.budget) }} ₽
                </span>
              </div>
              <RouterLink
                :to="`/destinations/${d.id}`"
                class="small text-decoration-none"
              >
                Открыть маршрут →
              </RouterLink>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { typeLabel, formatBudget } from "../composables/useDestinations.js";

defineProps({
  destinations: { type: Array, default: () => [] }
});
</script>
