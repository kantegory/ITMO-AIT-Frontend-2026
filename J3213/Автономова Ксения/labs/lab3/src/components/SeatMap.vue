<template>
  <div v-if="show" id="seatSection" class="mt-4">
    <h3 id="seatSectionHeading">Схема зала</h3>
    <div id="seatMap" class="ticket-platform__hall" aria-label="Схема зала">
      <button v-for="seat in seats" :key="seat" type="button" class="ticket-platform__seat" :class="seatClass(seat)" :aria-label="`Место ${seat}`" :aria-disabled="takenSeats.includes(String(seat))" :disabled="takenSeats.includes(String(seat))" @click="selectSeat(String(seat))"></button>
    </div>
    <div id="selectedSeatInfo" class="mt-2 text-center">{{ selectedSeat ? `Вы выбрали место ${selectedSeat}` : 'Выберите место на схеме' }}</div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  selectedSeat: {
    type: String,
    default: null
  },
  takenSeats: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:selectedSeat'])
const seats = computed(() => Array.from({ length: 100 }, (_, index) => index + 1))
function selectSeat(seat) {
  if (props.takenSeats.includes(seat)) return
  emit('update:selectedSeat', props.selectedSeat === seat ? null : seat)
}
function seatClass(seat) {
  const value = String(seat)
  return {
    'ticket-platform__seat--taken': props.takenSeats.includes(value),
    'ticket-platform__seat--selected': props.selectedSeat === value
  }
}
</script>
