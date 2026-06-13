<template>
  <div class="col-12 mb-4">
    <div class="card h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <div class="flex-grow-1">
            <router-link :to="`/fic/${fic.id}`" class="fic-title">
              {{ fic.title }}
            </router-link>
            
            <span class="rating-tag">{{ fic.rating }}</span>
            <span class="ms-2" :class="statusClass">{{ statusText }}</span>
            
            <p class="text-muted mb-2 mt-2">
              <span class="author-info">{{ fic.authorName }}</span>
              <span class="ms-3 date-info">{{ formattedDate }}</span>
            </p>
            
            <span class="fandom-tag">{{ fic.fandom }}</span>
            
            <p class="mt-2 mb-2 small">
              {{ truncatedDescription }}
            </p>
            
            <div class="mb-2">
              <span 
                v-for="tag in fic.tags" 
                :key="tag" 
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
            
            <div class="fic-meta">
              <span class="meta-heart">{{ fic.likes }}</span>
              <span class="meta-chat">{{ fic.commentsCount }}</span>
              <span class="meta-eye">{{ fic.views }}</span>
            </div>
          </div>
          
          <div v-if="showEditButton" class="ms-3">
            <router-link 
              :to="`/write/${fic.id}`" 
              class="btn btn-main btn-sm"
            >
              Редактировать
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  fic: {
    type: Object,
    required: true
  },
  showEditButton: {
    type: Boolean,
    default: false
  }
})

const statusText = computed(() => {
  switch (props.fic.status) {
    case 'completed': return 'Закончен'
    case 'in_progress': return 'В процессе'
    case 'draft': return 'Черновик'
    default: return 'Опубликован'
  }
})

const statusClass = computed(() => {
  switch (props.fic.status) {
    case 'completed': return 'text-success'
    case 'in_progress': return 'text-warning'
    case 'draft': return 'text-secondary'
    default: return ''
  }
})

const formattedDate = computed(() => {
  return new Date(props.fic.createdAt).toLocaleDateString('ru-RU')
})

const truncatedDescription = computed(() => {
  if (!props.fic.description) return ''
  return props.fic.description.length > 100 
    ? props.fic.description.substring(0, 100) + '...' 
    : props.fic.description
})
</script>