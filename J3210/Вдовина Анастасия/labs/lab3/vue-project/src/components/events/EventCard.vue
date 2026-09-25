<template>
  <article class="card event-card h-100">
    <div class="event-card__image-wrap" :style="{ backgroundImage: `url('${event.image}')` }">
      <img
        :src="event.image"
        class="event-card__image"
        loading="lazy"
        :alt="`Афиша: ${event.title}, ${event.cityLabel}`"
      />
    </div>

    <div class="card-body event-card__body">
      <span class="badge text-bg-light align-self-start">{{ event.typeLabel }}</span>

      <component :is="headingTag" class="event-card__title h5">
        <router-link class="stretched-link" :to="{ name: 'event', params: { id: event.id } }">
          {{ event.title }}
        </router-link>
      </component>

      <p class="event-card__meta mb-0">
        <icon-component name="calendar" />{{ event.dateShort
        }}<span v-if="event.timeLabel">, {{ event.timeLabel }}</span>
        · <icon-component name="pin" />{{ event.cityLabel }}, {{ event.venueShort }}
      </p>

      <div class="event-card__footer">
        <span class="fw-semibold">{{ event.priceLabel }}</span>
      </div>
    </div>
  </article>
</template>

<script>
import IconComponent from '@/components/common/IconComponent.vue'

export default {
  name: 'EventCard',
  components: { IconComponent },
  props: {
    event: {
      type: Object,
      required: true,
    },
    // на главной карточки стоят под заголовком «Ближайшие мероприятия», поэтому там h3
    headingTag: {
      type: String,
      default: 'h2',
    },
  },
}
</script>
