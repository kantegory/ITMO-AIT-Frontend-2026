<script setup>
defineProps({
  image: {
    type: String,
    default: null,
  },
  add: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button v-if="add" type="button" class="dp-card dp-card-add" aria-label="Добавить дата поинт">
    <span class="dp-add-icon" aria-hidden="true">+</span>
  </button>
  <div v-else class="dp-card" :class="{ 'dp-card-empty': !image }">
    <img v-if="image" :src="image" alt="" class="dp-card-img" />
  </div>
</template>

<style scoped>
.dp-card {
  aspect-ratio: 1;
  border-radius: var(--bs-border-radius);
  border: 1px solid var(--bs-border-color);
  overflow: hidden;
  width: 100%;
  padding: 0;
  background: none;
}

.dp-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.dp-card-empty {
  background: var(--bs-secondary-bg);
}

.dp-card-add {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bs-tertiary-bg);
  cursor: pointer;
  color: var(--bs-secondary-color);
  transition:
    background 150ms ease,
    color 150ms ease;
}

.dp-card-add:hover {
  background: var(--bs-secondary-bg);
  color: var(--bs-primary);
}

.dp-add-icon {
  font-size: 2.5rem;
  line-height: 1;
  font-weight: 300;
}
</style>
