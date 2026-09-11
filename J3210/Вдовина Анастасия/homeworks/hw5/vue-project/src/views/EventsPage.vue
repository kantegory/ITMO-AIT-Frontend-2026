<template>
  <base-layout>
    <h1>Мероприятия EventTix</h1>

    <form ref="eventForm" @submit.prevent="createCard" class="d-flex flex-column my-5">
      <input type="text" v-model="form.title" placeholder="Название" class="my-1" />
      <input type="text" v-model="form.cityLabel" placeholder="Город" class="my-1" />
      <input type="text" v-model="form.venueShort" placeholder="Площадка" class="my-1" />
      <input type="text" v-model="form.dateShort" placeholder="Дата" class="my-1" />
      <button type="submit" class="btn btn-primary">Отправить</button>
    </form>

    <div class="row row-cols-1 row-cols-md-2 g-4 mt-5" id="events">
      <div class="col" v-for="event in events" :key="event.id">
        <event-card
          :title="event.title"
          :date-short="event.dateShort"
          :city-label="event.cityLabel"
          :venue-short="event.venueShort"
          :price-label="event.priceLabel"
        />
      </div>
    </div>
  </base-layout>
</template>

<script>
import { mapActions, mapState } from 'pinia'

import BaseLayout from '@/layouts/BaseLayout.vue'
import EventCard from '@/components/EventCard.vue'
import useEventsStore from '@/stores/events'

export default {
  name: 'EventsPage',
  components: { BaseLayout, EventCard },

  data() {
    return {
      form: {
        title: '',
        cityLabel: '',
        venueShort: '',
        dateShort: '',
        priceLabel: 'Бесплатно',
        free: true,
      },
    }
  },

  computed: {
    ...mapState(useEventsStore, ['events']),
  },

  methods: {
    ...mapActions(useEventsStore, ['loadEvents', 'createEvent']),

    async createCard() {
      await this.createEvent(this.form)
      await this.loadEvents()

      this.$refs.eventForm.reset()
    },
  },

  mounted() {
    this.loadEvents()
  },
}
</script>
