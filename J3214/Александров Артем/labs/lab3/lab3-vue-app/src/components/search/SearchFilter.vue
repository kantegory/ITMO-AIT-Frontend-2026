<template>
  <div class="card border-0 shadow-sm p-4 mb-4 rounded-4 theme-card">
    <h2 class="h6 fw-bold mb-4">Параметры фильтрации</h2>
    
    <form class="row g-3 align-items-end" @submit.prevent>
      <div class="col-12 col-md-3">
        <label for="filterCategory" class="form-label small fw-medium theme-text-muted">
          <i class="bi bi-tag me-1"></i> Категория
        </label>
        <select 
          id="filterCategory" 
          :value="category" 
          class="theme-text-main form-select shadow-none py-2 theme-bg-secondary border-0"
          @change="$emit('update:category', $event.target.value)"
        >
          <option value="">Все категории</option>
          <option value="Еда и продукты">Еда и продукты</option>
          <option value="Кафе и рестораны">Кафе и рестораны</option>
          <option value="Покупки">Покупки</option>
          <option value="Доходы">Доходы</option>
        </select>
      </div>

      <div class="col-12 col-md-3">
        <label for="filterAmount" class="form-label small fw-medium theme-text-muted">
          <i class="bi bi-cash me-1"></i> Макс. сумма ($)
        </label>
        <input 
          id="filterAmount" 
          :value="amount" 
          type="number" 
          class="form-control shadow-none py-2 theme-bg-secondary border-0" 
          placeholder="Например: 5000" 
          @input="$emit('update:amount', $event.target.value ? Number($event.target.value) : null)"
        />
      </div>

      <div class="col-12 col-md-3">
        <label for="filterDate" class="form-label small fw-medium theme-text-muted">
          <i class="bi bi-calendar3 me-1"></i> Дата операции
        </label>
        <input 
          id="filterDate" 
          :value="date" 
          type="date" 
          class="theme-text-main form-control shadow-none py-2 theme-bg-secondary border-0" 
          @input="$emit('update:date', $event.target.value)"
        />
      </div>

      <div class="col-12 col-md-3">
        <button type="button" class="btn btn-outline-secondary w-100 fw-medium py-2" @click="$emit('reset')">
          Сбросить
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
defineProps({
  category: {
    type: String,
    default: ''
  },
  amount: {
    type: [Number, null],
    default: null
  },
  date: {
    type: String,
    default: ''
  }
})

defineEmits(['update:category', 'update:amount', 'update:date', 'reset'])
</script>