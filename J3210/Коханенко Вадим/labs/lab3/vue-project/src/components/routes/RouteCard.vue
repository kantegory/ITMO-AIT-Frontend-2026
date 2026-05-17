<template>
  <div class="card route-card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h3 class="h5 card-title">{{ route.title }}</h3>
        <span class="badge bg-success">{{ route.duration }}</span>
      </div>
      <div class="route-duration mb-2">
        <svg class="icon"><use xlink:href="/sprite.svg#icon-geo-alt"></use></svg>
        {{ route.points }}
      </div>
      <p class="card-text">
        {{ truncatedDescription }}
        <RouterLink :to="`/destination/${route.destinationId}`" class="text-success text-decoration-none">
          читать далее
        </RouterLink>
      </p>
    </div>
    <div class="card-footer">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <span class="badge bg-light text-dark me-1">
            <svg class="icon"><use xlink:href="/sprite.svg#icon-tag"></use></svg>
            {{ route.budget }} бюджет
          </span>
          <span class="badge bg-light text-dark me-1">
            <svg class="icon"><use :xlink:href="`/sprite.svg#${typeIcon}`"></use></svg>
            {{ route.type }}
          </span>
        </div>
        <button class="btn btn-sm btn-outline-danger" @click="$emit('delete')">
          <svg class="icon"><use xlink:href="/sprite.svg#icon-trash"></use></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  route: {
    type: Object,
    required: true
  }
})

defineEmits(['delete'])

const typeIcon = computed(() => {
  const icons = {
    'Город': 'icon-building',
    'Природа': 'icon-tree',
    'Смешанный': 'icon-arrow-repeat'
  }
  return icons[props.route.type] || 'icon-arrow-repeat'
})

const truncatedDescription = computed(() => {
  if (props.route.description && props.route.description.length > 250) {
    return props.route.description.substring(0, 250) + '…'
  }
  return props.route.description
})
</script>