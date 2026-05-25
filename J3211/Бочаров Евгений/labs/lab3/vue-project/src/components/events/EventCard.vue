<template>
  <div class="col-md-4 mb-4">
    <div class="card h-100 shadow-sm">
      <div class="card-img-container">
        <img :src="event.poster" class="card-img-top" :alt="event.title">
      </div>
      <div class="card-body d-flex flex-column">
        <span class="badge bg-secondary mb-2">{{ typeLabels[event.type] || event.type }}</span>
        <h3 class="card-title h5">
          <router-link :to="{ name: 'EventDetail', params: { id: event.id } }" class="text-decoration-none">
            {{ event.title }}
          </router-link>
        </h3>
        <p class="text-muted small flex-grow-1">
          <Icon name="map-pin" size="12" /> {{ event.venue?.name }}
        </p>
        <p class="small text-muted">
          <Icon name="calendar" size="12" /> {{ formatDate(event.dates?.[0]?.datetime) }}
        </p>
        <router-link :to="{ name: 'EventDetail', params: { id: event.id } }" class="btn btn-primary btn-sm">
          Подробнее
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import Icon from '@/components/ui/Icon.vue'

defineProps({ event: Object, required: true })
const typeLabels = { theater: 'Театр', concert: 'Концерт', standup: 'Стендап', festival: 'Фестиваль' }
const formatDate = (d) => d ? new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Дата не указана'
</script>