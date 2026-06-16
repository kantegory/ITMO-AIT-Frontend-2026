<template>
  <div class="col-12 col-md-6 col-lg-4 mb-4">
    <div class="card h-100 border-secondary" :style="{ backgroundColor: cardBg }">
      <div class="card-body">
        <h5 class="card-title">{{ modelName }}</h5>
        <p class="card-text small" :class="textClass">
          Author: {{ model.author || 'Community' }}
        </p>
        <span class="badge badge-ai mb-3">{{ task }}</span>
        <p class="card-text">
          <span class="text-warning">⭐</span> {{ formattedDownloads }} downloads
        </p>
        <div class="d-flex gap-2 mt-3">
          <button 
            @click="$emit('view-details', model)" 
            class="btn btn-outline-light btn-sm"
          >
            View Details
          </button>
          <button 
            @click="$emit('toggle-like', model)" 
            :class="isLiked ? 'btn-danger' : 'btn-outline-danger'"
            class="btn btn-sm"
          >
            {{ isLiked ? '❤️' : '🤍' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  model: {
    type: Object,
    required: true
  },
  isLiked: {
    type: Boolean,
    default: false
  }
})

defineEmits(['view-details', 'toggle-like'])

const modelName = computed(() => {
  return props.model.id.split('/').pop() || 'Unknown Model'
})

const task = computed(() => {
  return props.model.pipeline_tag || 'Generic Model'
})

const formattedDownloads = computed(() => {
  const downloads = props.model.downloads || 0
  if (downloads >= 1000) {
    return (downloads / 1000).toFixed(1) + 'k'
  }
  return downloads
})

const cardBg = computed(() => {
  const theme = document.documentElement.getAttribute('data-theme')
  return theme === 'light' ? '#ffffff' : '#1e293b'
})

const textClass = computed(() => {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'text-muted' : 'text-muted'
})
</script>
