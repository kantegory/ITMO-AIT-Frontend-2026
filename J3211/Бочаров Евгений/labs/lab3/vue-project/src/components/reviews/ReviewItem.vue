<template>
  <div class="review-item mb-3 d-flex">
    <img :src="review.userAvatar" class="rounded-circle me-3" width="40" height="40">
    <div>
      <h4 class="fs-6 mb-0">
        {{ review.userName }}
        <small class="text-muted">· {{ new Date(review.createdAt).toLocaleDateString('ru-RU') }}</small>
      </h4>
      <div class="text-warning mb-2">
        <Icon v-for="i in 5" :key="i" :name="i <= review.rating ? 'star' : 'star-empty'" size="16" />
      </div>
      <p class="mb-0">{{ review.text }}</p>
    </div>
  </div>
</template>

<script setup>
import Icon from '@/components/ui/Icon.vue'
defineProps({ review: Object, required: true })
</script>