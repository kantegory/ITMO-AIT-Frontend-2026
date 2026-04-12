<script setup>
import DestinationCard from './DestinationCard.vue'

defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <section class="list" aria-label="Направления для путешествий">
    <h2 class="list__heading">Куда поехать</h2>
    <ul class="list__grid">
      <li v-for="item in items" :key="item.id" class="list__item">
        <DestinationCard
          :title="item.title"
          :country="item.country"
          :description="item.description"
        />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.list {
  padding: 1.25rem 1rem 2rem;
  flex: 1;
}

.list__heading {
  margin: 0 0 1rem;
  font-size: 1.15rem;
  color: #1e293b;
}

.list__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.list__item {
  margin: 0;
}
</style>
