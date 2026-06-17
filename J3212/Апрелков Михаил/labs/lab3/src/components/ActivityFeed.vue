<template>
  <section class="card tripatropa-card" aria-labelledby="activity-title">
    <div class="card-body">
      <h2 class="h6 mb-3" id="activity-title">Лента активности</h2>
      <ul class="list-group list-group-flush text-muted-sm">
        <li
          v-for="act in activities"
          :key="act.id"
          class="list-group-item"
        >
          {{ act.text }}
        </li>
        <li v-if="!activities.length" class="list-group-item">
          Активности пока нет.
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineProps({
  activities: { type: Array, default: () => [] }
});
</script>
