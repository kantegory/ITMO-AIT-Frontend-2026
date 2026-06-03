<script setup>
defineProps({
  events: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div v-if="!events.length" class="empty-state">Вы еще не создали ни одного события.</div>
  <div v-else class="d-grid gap-3">
    <article v-for="event in events" :key="event.id" class="org-event-card">
      <div class="d-flex justify-content-between align-items-start gap-2 flex-wrap">
        <div>
          <h3 class="h6 m-0">{{ event.name }}</h3>
          <p class="small text-secondary m-0">{{ event.category }} | {{ event.date }} | {{ event.city }}</p>
          <p class="small text-secondary m-0">{{ event.time || '19:00' }} | {{ event.age || '6+' }}</p>
          <p class="small text-secondary m-0">{{ event.venue }} | {{ Number(event.price).toLocaleString('ru-RU') }} руб.</p>
        </div>
        <span class="badge text-bg-light border">Опубликовано</span>
      </div>
    </article>
  </div>
</template>
