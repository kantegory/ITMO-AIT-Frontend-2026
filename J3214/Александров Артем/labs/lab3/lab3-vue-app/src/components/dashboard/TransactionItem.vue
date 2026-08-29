<template>
  <div class="d-flex justify-content-between align-items-center py-2 border-bottom theme-border">
    <div class="d-flex align-items-center gap-3">

      <!-- иконка в зависимости от isIncome -->
      <div 
        class="rounded-3 d-flex justify-content-center align-items-center" 
        :class="isIncome ? 'bg-success-subtle text-success' : 'bg-light text-secondary'" 
        style="width: 40px; height: 40px;"
      >
        <i :class="['bi', isIncome ? 'bi-wallet2' : 'bi-cart3', 'fs-5']"></i>
      </div>

      <!-- название и категория -->
      <div>
        <div class="fw-semibold theme-text-main" style="font-size: 14px;">{{ item.title }}</div>
        <div class="theme-text-muted" style="font-size: 11px;">
          <span v-if="item.date"> {{ formattedDate }}</span>
        </div>
      </div>
    </div>

    <!-- отображение дохода/расхода с кнопкой удаления -->
    <div class="d-flex align-items-center gap-3">
      <span class="fw-bold" :class="isIncome ? 'text-success' : 'theme-text-main'" style="font-size: 14px;">
        {{ isIncome ? '+' : '-' }}${{ Math.abs(item.amount).toFixed(2) }}
      </span>

      <button 
        class="btn btn-sm btn-outline-danger border-0 p-1" 
        title="Удалить" 
        @click="$emit('delete-item', item.id)"
      >
        <i class="bi bi-trash"></i>
      </button>
    </div>
  </div>
</template>

<!-- выполняется при каждой инициализации компонента -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

defineEmits(['delete-item'])

const isIncome = computed(() => props.item.amount > 0)

// Форматирование даты
const formattedDate = computed(() => {
  if (!props.item?.date) return ''
  
  const d = new Date(props.item.date)
  if (isNaN(d.getTime())) return props.item.date

  return d.toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'long', 
    hour: '2-digit', 
    minute: '2-digit' })
})
</script>