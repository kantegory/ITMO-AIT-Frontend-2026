<template>
  <div class="card border-0 shadow-sm p-3 mb-3">
    <div class="d-flex justify-content-between gap-3 flex-wrap">
      <div class="organizer-event-info">
        <h5 class="mb-1 section-title-with-icon">
          <base-icon name="ticket" />
          <span>{{ event.title }}</span>
        </h5>
        <p class="mb-1 text-muted">{{ typeLabel(event.type) }}</p>
        <p class="mb-1 meta-with-icon">
          <base-icon name="calendar" />
          <span>{{ event.cityLabel || event.city }} • {{ event.date }} • {{ event.place }}</span>
        </p>
        <p class="mb-3">{{ event.description }}</p>

        <div class="organizer-event-actions">
          
          <button
            type="button"
            class="btn btn-outline-primary btn-sm btn-icon"
            :aria-label="`Редактировать мероприятие ${event.title}`"
            @click="$emit('edit', event)"
          >
            <base-icon name="edit" />
            <span>Редактировать</span>
          </button>
          <button
            type="button"
            class="btn btn-danger btn-sm btn-icon"
            :aria-label="`Удалить мероприятие ${event.title}`"
            @click="$emit('delete', event.id)"
          >
            <base-icon name="trash" />
            <span>Удалить</span>
          </button>
        </div>
      </div>
      
      <event-image
        :src="event.image"
        :alt="event.title"
        image-class="organizer-event-thumb"
      />
    </div>
  </div>
</template>

<script>

import useEventTypes from '@/composables/useEventTypes'
import BaseIcon from '@/components/BaseIcon.vue'
import EventImage from '@/components/EventImage.vue'

export default {
  name: 'OrganizerEventItem',
  components: { BaseIcon, EventImage },
  props: {
    event: { type: Object, required: true }
  },

  emits: ['edit', 'delete'],
  setup() {
    const { typeLabel } = useEventTypes()
    return { typeLabel }
  }
}

</script>
