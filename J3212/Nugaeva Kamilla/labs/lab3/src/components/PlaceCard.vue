<template>
  <article class="card card-hover popular-card h-100">
    <img
      :src="imageSrc"
      class="card-img-top"
      :alt="place.title"
    />

    <div class="card-body">
      <span class="place-badge">
        {{ typeLabel }}
      </span>

      <h3 class="h4 card-title mb-2">
        {{ place.title }}
      </h3>

      <p class="place-meta">
        {{ place.days }} дней · до {{ place.budget }} $
      </p>

      <p class="text-muted mb-3">
        {{ place.description }}
      </p>

      <RouterLink
        class="btn btn-outline-primary"
        :to="`/destination/${place.key}`"
      >
        Открыть
      </RouterLink>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  place: {
    type: Object,
    required: true,
  },
})

const typeLabel = computed(() => {
  if (props.place.type === 'city') {
    return 'Город'
  }

  if (props.place.type === 'nature') {
    return 'Природа'
  }

  return 'Направление'
})

const imageSrc = computed(() => {
  const image = props.place.hero || props.place.image || props.place.gallery?.[0] || 'assets/img/hero.jpg'

  if (image.startsWith('/')) {
    return image
  }

  return `/${image}`
})
</script>