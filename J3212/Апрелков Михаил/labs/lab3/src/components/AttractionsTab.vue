<template>
  <div>
    <div class="row g-4">
      <div
        v-for="(item, idx) in attractions"
        :key="idx"
        class="col-md-4"
      >
        <div class="card tripatropa-card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ item.name }}</h5>
            <p class="card-text text-muted-sm">{{ item.description }}</p>
            <span class="badge bg-primary-subtle text-primary">{{ item.day }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4" v-if="recommendations && recommendations.length">
      <h2 class="h6 mb-2">Рекомендации по маршруту</h2>
      <ul class="list-group">
        <li
          v-for="(rec, idx) in recommendations"
          :key="idx"
          class="list-group-item"
        >
          {{ rec }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  attractions: { type: Array, default: () => [] },
  recommendations: { type: Array, default: () => [] }
});
</script>
