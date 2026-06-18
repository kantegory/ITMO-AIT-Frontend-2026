<template>
  <ul class="ticket-platform__list">
    <li v-if="!items.length" class="ticket-platform__list-item">{{ emptyText }}</li>
    <li v-for="(item, index) in items" :key="item.id" class="ticket-platform__list-item d-flex justify-content-between align-items-start flex-wrap">
      <div class="me-2">
        <strong>{{ eventTitle(item.eventId) }}</strong><br>
        <span>{{ eventInfo(item.eventId) }}{{ item.seat ? `, место ${item.seat}` : '' }}</span>
      </div>
      <button v-if="returnable" class="btn btn-sm btn-outline-danger mt-2 mt-md-0" type="button" @click="$emit('return-ticket', item, index)">Вернуть</button>
    </li>
  </ul>
</template>
<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  events: {
    type: Array,
    default: () => []
  },
  emptyText: {
    type: String,
    required: true
  },
  returnable: {
    type: Boolean,
    default: false
  }
})
defineEmits(['return-ticket'])
function findEvent(id) {
  return props.events.find((event) => event.id === id) || {}
}
function eventTitle(id) {
  return findEvent(id).title || 'Мероприятие'
}
function eventInfo(id) {
  const event = findEvent(id)
  return `${event.date || ''} - ${event.location || ''}`
}
</script>
