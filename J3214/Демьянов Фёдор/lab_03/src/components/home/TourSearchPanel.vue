<template>
  <div :class="['search-panel glass-panel p-4 p-md-5 mt-4', glowClass]">
    <form class="row g-4" role="search" aria-label="Параметры поиска миссий" @submit.prevent>
      <div class="col-md-4 text-start">
        <label for="destination" class="form-label">Направление</label>
        <select
          id="destination"
          class="form-select glass-input shadow-none"
          :value="filters.destination"
          @change="$emit('update:filter', { key: 'destination', value: $event.target.value })"
        >
          <option value="">Все орбиты</option>
          <option value="earth">Орбита Земли</option>
          <option value="moon">Луна</option>
          <option value="mars">Марс</option>
          <option value="enceladus">Энцелад</option>
        </select>
      </div>

      <div class="col-md-4 text-start">
        <label for="duration" class="form-label">Длительность</label>
        <select
          id="duration"
          class="form-select glass-input shadow-none"
          :value="filters.duration"
          @change="$emit('update:filter', { key: 'duration', value: $event.target.value })"
        >
          <option value="">Любая</option>
          <option value="short">До 7 суток</option>
          <option value="long">Более 7 суток</option>
        </select>
      </div>

      <div class="col-md-4 text-start">
        <label for="budget" class="form-label">Класс миссии</label>
        <select
          id="budget"
          class="form-select glass-input shadow-none"
          :value="filters.budget"
          @change="$emit('update:filter', { key: 'budget', value: $event.target.value })"
        >
          <option value="">Все классы</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
          <option value="vip">VIP Explorer</option>
        </select>
      </div>

      <div class="col-12 mt-4">
        <button
          type="button"
          class="btn btn-accent w-100 py-3 letter-spacing-2 fs-7"
          @click="$emit('search')"
        >
          Найти экспедицию
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

defineEmits(['update:filter', 'search'])

const glowClass = computed(() => {
  if (props.filters.budget === 'premium') return 'glow-premium'
  if (props.filters.budget === 'vip') return 'glow-vip'
  return ''
})
</script>