<template>
  <div>
    <!-- Фильтр по типу -->
    <div class="d-flex gap-2 flex-wrap mb-3">
      <button
        v-for="f in filters"
        :key="f.value"
        class="filter-chip"
        :class="{ active: activeFilter === f.value }"
        @click="activeFilter = f.value">
        {{ f.label }}
      </button>
    </div>

    <!-- Список -->
    <div class="d-flex flex-column gap-2">
      <div
        v-for="a in visible"
        :key="a.name"
        class="attraction-item">
        <div class="attraction-icon">{{ a.icon }}</div>
        <div class="flex-1">
          <div class="d-flex justify-content-between align-items-start">
            <strong style="font-size:.9rem;">{{ a.name }}</strong>
            <div class="stars" style="font-size:.78rem;">
              {{ '★'.repeat(a.rating) }}{{ '☆'.repeat(5 - a.rating) }}
            </div>
          </div>
          <p style="font-size:.8rem;color:var(--text-muted);margin:.2rem 0 .4rem;">{{ a.desc }}</p>
          <div class="d-flex gap-1 flex-wrap">
            <span
              v-for="tag in a.tags"
              :key="tag"
              :class="['tag', tag === 'Must-see' ? 'tag-warm' : '']"
              style="font-size:.7rem;">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  attractions: { type: Array, default: () => [] },
})

const filters = [
  { value: 'all',          label: 'Все'          },
  { value: 'architecture', label: 'Архитектура'  },
  { value: 'museum',       label: 'Музеи'        },
  { value: 'nature',       label: 'Природа'      },
  { value: 'park',         label: 'Парки'        },
]

const activeFilter = ref('all')

const visible = computed(() =>
  activeFilter.value === 'all'
    ? props.attractions
    : props.attractions.filter(a => a.type === activeFilter.value)
)
</script>
