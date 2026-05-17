<template>
  <div class="card note-card h-100">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span class="badge-type">
        <svg class="icon"><use :xlink:href="`/sprite.svg#${typeIcon}`"></use></svg>
        {{ note.type }}
      </span>
      <div class="btn-group btn-group-sm">
        <button class="btn btn-outline-primary" @click="$emit('edit')">
          <svg class="icon"><use xlink:href="/sprite.svg#icon-pencil"></use></svg>
        </button>
        <button class="btn btn-outline-danger" @click="$emit('delete')">
          <svg class="icon"><use xlink:href="/sprite.svg#icon-trash"></use></svg>
        </button>
      </div>
    </div>
    <div class="card-body">
      <h3 class="h5 card-title">{{ note.title }}</h3>
      <h4 v-if="note.date" class="h6 card-subtitle mb-2 text-muted">
        <svg class="icon"><use xlink:href="/sprite.svg#icon-calendar"></use></svg>
        {{ note.date }}
      </h4>
      <p class="card-text">
        {{ truncatedContent }}
        <a v-if="isLong" href="#" class="text-success text-decoration-none" @click.prevent="showFullNote">
          читать далее
        </a>
      </p>
      <div v-if="tags.length" class="mt-3">
        <span v-for="tag in tags" :key="tag" class="badge bg-light text-dark me-1">{{ tag }}</span>
      </div>
    </div>
  </div>
  
  <!-- Модалка для полного текста -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header bg-success text-white">
        <h5 class="modal-title">
          <svg class="icon"><use xlink:href="/sprite.svg#icon-journal-bookmark"></use></svg>
          {{ note.title }}
        </h5>
        <button type="button" class="btn-close-custom" @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <p v-if="note.date" class="text-muted">
          <svg class="icon"><use xlink:href="/sprite.svg#icon-calendar"></use></svg> {{ note.date }}
        </p>
        <p>{{ note.content }}</p>
        <div v-if="tags.length" class="mt-3">
          <span v-for="tag in tags" :key="tag" class="badge bg-light text-dark me-1">{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  note: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const showModal = ref(false)

const typeIcon = computed(() => {
  const icons = {
    'Город': 'icon-building',
    'Природа': 'icon-tree',
    'Смешанный': 'icon-arrow-repeat'
  }
  return icons[props.note.type] || 'icon-arrow-repeat'
})

const tags = computed(() => {
  if (!props.note.tags) return []
  return props.note.tags.split(/[\s,]+/).filter(t => t.trim())
})

const isLong = computed(() => props.note.content && props.note.content.length > 100)
const truncatedContent = computed(() => {
  if (!isLong.value) return props.note.content
  return props.note.content.substring(0, 100) + '…'
})

const showFullNote = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
</script>