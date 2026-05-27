<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const meta = computed(() =>
  [props.item.framework, props.item.license].filter(Boolean).join(' • ')
)
</script>

<template>
  <article class="card">
    <span class="badge" :class="props.item.type === 'model' ? 'badge-model' : 'badge-dataset'">
      {{ props.item.type === 'model' ? 'Model' : 'Dataset' }}
    </span>

    <h2>{{ props.item.name }}</h2>
    <p class="meta">{{ meta }}</p>
    <small class="stats">★ {{ props.item.stars }} | {{ props.item.downloads }} downloads</small>
  </article>
</template>

<style scoped>
.card {
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 16px;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 10px;
}

.badge-model {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-dataset {
  background: #dcfce7;
  color: #166534;
}

h2 {
  margin: 0 0 6px;
  font-size: 1.1rem;
}

.meta {
  margin: 0 0 8px;
  color: #475569;
}

.stats {
  color: #334155;
}
</style>
