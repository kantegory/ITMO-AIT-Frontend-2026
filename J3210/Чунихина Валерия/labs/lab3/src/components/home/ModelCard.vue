<template>
  <article class="card h-100 border-0 shadow-sm card-hover" :class="`model-card--${variant}`">
    <div class="card-body" :class="bodyClass">
      <div class="d-flex justify-content-between align-items-start mb-3 gap-3">
        <span
          class="badge"
          :class="type === 'Dataset' ? 'badge-dataset' : 'badge-model'"
        >
          {{ type }}
        </span>

        <span v-if="downloads" class="text-muted small">
          {{ downloads }} загрузок
        </span>
      </div>

      <h3 class="fw-bold" :class="titleClass">{{ title }}</h3>

      <p class="text-muted mb-2 description-clamp" :class="descriptionClass">
        {{ description }}
      </p>

      <p v-if="meta" class="small mb-0 meta-clamp" style="color: var(--bloom-green); font-weight: 500;">
        {{ meta }}
      </p>

      <RouterLink
        :to="to"
        class="btn btn-outline-primary btn-sm mt-3"
      >
        {{ buttonText }}
      </RouterLink>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    required: true
  },
  downloads: {
    type: String,
    default: ''
  },
  meta: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'standard'
  },
  to: {
    type: [String, Object],
    default: '/details/forest-vision-v2'
  }
})

const titleClass = computed(() => {
  if (props.variant === 'featured') return 'h4 mb-3'
  if (props.variant === 'compact') return 'h6 mb-2'
  return 'h5 mb-3'
})

const descriptionClass = computed(() => (
  props.variant === 'compact' ? 'small' : 'small'
))

const bodyClass = computed(() => {
  if (props.variant === 'featured') return 'p-4 p-xl-5'
  if (props.variant === 'compact') return 'p-3'
  return 'p-4'
})
</script>

<style scoped>
.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.45;
  min-height: calc(1.45em * 2);
}

.meta-clamp {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.model-card--featured {
  min-height: 100%;
}

.model-card--compact .btn {
  min-height: 40px;
}
</style>
