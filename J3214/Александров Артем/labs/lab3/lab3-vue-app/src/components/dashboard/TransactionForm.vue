<template>
  <div class="theme-card p-4 shadow-sm border-0 theme-border rounded-4 mb-4">
    <div class="d-flex align-items-center gap-2 mb-3">
      <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center" style="width: 32px; height: 32px;">
        <i class="bi bi-plus-lg"></i>
      </div>
      <h2 class="h6 fw-bold m-0 theme-text-main">Новая транзакция</h2>
    </div>

    <form @submit.prevent="handleSubmit" class="row g-3">
      <div class="col-12 col-md-4">
        <label class="form-label small theme-text-muted fw-medium mb-1">Название</label>
        <input 
          v-model.trim="title" 
          type="text" 
          class="form-control shadow-none py-2 theme-bg-secondary border-0" 
          placeholder="Например: Супермаркет" 
          required 
        />
      </div>

      <div class="col-12 col-md-4">
        <label class="form-label small theme-text-muted fw-medium mb-1">Сумма</label>
        <input 
          v-model.number="amount" 
          type="number" 
          step="0.01" 
          class="form-control shadow-none py-2 theme-bg-secondary border-0" 
          placeholder="-45.50 или 1000" 
          required 
        />
      </div>

      <div class="col-12 col-md-4">
        <label class="form-label small theme-text-muted fw-medium mb-1">Категория</label>
        <select v-model="category" class="form-select shadow-none py-2 theme-bg-secondary border-0 theme-text-main">
          <option value="Еда и продукты">Еда и продукты</option>
          <option value="Кафе и рестораны">Кафе и рестораны</option>
          <option value="Покупки">Покупки</option>
          <option value="Доходы">Доходы / Переводы</option>
        </select>
      </div>

      <div class="col-12 text-end mt-3">
        <button type="submit" class="btn btn-primary px-4 py-2 rounded-3 fw-medium">
          Сохранить операцию
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add-item'])

const title = ref('')
const amount = ref('')
const category = ref('Еда и продукты')

const handleSubmit = () => {
  if (!title.value || amount.value === '') return

  emit('add-item', {
    id: Date.now(),
    title: title.value,
    amount: Number(amount.value),
    category: category.value,
    date: new Date().toLocaleDateString('ru-RU')
  })

  title.value = ''
  amount.value = ''
  category.value = 'Еда и продукты'
}
</script>