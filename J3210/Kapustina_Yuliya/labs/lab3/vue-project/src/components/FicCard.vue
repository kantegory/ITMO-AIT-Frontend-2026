<template>
  <div class="col-md-4 mb-4">
    <router-link :to="`/fic/${fic.id}`" class="text-decoration-none text-dark">
      <div class="card h-100">
        <div class="card-body">
          <span class="fandom-tag">{{ fic.fandom }}</span>
          <h5 class="mt-2">{{ fic.title }}</h5>
          <p class="text-muted small mt-2 mb-0">
            {{ truncatedDescription }}
          </p>
        </div>
        <div class="card-footer bg-transparent pt-0 pb-3 border-0">
          <div class="fic-meta">
            <span class="meta-heart">{{ fic.likes }}</span>
            <span class="meta-chat">{{ fic.commentsCount }}</span>
            <span class="meta-eye">{{ fic.views }}</span>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  fic: {
    type: Object,
    required: true
  }
})

const truncatedDescription = computed(() => {
  if (!props.fic.description) return ''
  return props.fic.description.length > 100 
    ? props.fic.description.substring(0, 100) + '...' 
    : props.fic.description
})
</script>