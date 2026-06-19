<script setup>
import { computed } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  purchasing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['buy'])

const descriptionText = computed(() =>
  props.event.source === 'organizer'
    ? `${props.event.description} Организатор: ${props.event.organizerName}.`
    : props.event.description,
)

const priceLabel = computed(() => {
  if (props.event.price?.isFree) {
    return 'Бесплатно'
  }

  if (props.event.price?.isKnown) {
    return `от ${Number(props.event.price.value).toLocaleString('ru-RU')} руб.`
  }

  return 'Цена уточняется'
})
</script>

<template>
  <article class="event-card h-100">
    <img :src="event.image" class="event-card-img" :alt="event.title" />
    <div class="p-3">
      <p class="small text-secondary mb-2">{{ event.category }} | {{ event.dateLabel }} | {{ event.city }}</p>
      <h3 class="h5">
        <a v-if="event.isExternalUrl" class="text-decoration-none text-dark" :href="event.url" target="_blank" rel="noopener noreferrer">
          {{ event.title }}
        </a>
        <RouterLink v-else class="text-decoration-none text-dark" :to="event.route">{{ event.title }}</RouterLink>
      </h3>
      <p class="text-secondary mb-3">{{ descriptionText }}</p>
      <div class="d-flex justify-content-between align-items-center gap-2">
        <span class="fw-semibold">{{ priceLabel }}</span>
        <button class="btn btn-sm btn-outline-primary" type="button" :disabled="purchasing" @click="emit('buy', event)">
          Купить
        </button>
      </div>
    </div>
  </article>
</template>
