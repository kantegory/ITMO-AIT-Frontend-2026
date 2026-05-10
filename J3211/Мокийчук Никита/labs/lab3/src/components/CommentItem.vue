<script setup>
import { useFormatters } from '../composables/useFormatters'

defineProps({
  comment: { type: Object, required: true }
})

const { getInitials, formatDateTime } = useFormatters()
</script>

<template>
  <div class="comment-item">
    <div class="d-flex gap-3">
      <div class="comment-avatar">{{ getInitials(comment.author) }}</div>
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <strong>{{ comment.author }}</strong>
          <small class="text-muted">{{ formatDateTime(comment.createdAt) }}</small>
        </div>
        <p class="mb-0">{{ comment.text }}</p>
      </div>
    </div>
  </div>
</template>
