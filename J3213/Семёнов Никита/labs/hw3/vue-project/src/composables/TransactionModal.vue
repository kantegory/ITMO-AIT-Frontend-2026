<template>
  <div class="modal fade" id="addTransactionModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5">Добавить транзакцию</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" id="close-modal-btn"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Тип операции</label>
              <select v-model="form.type" class="form-select" required>
                <option value="expense">Расход</option>
                <option value="income">Доход</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Дата</label>
              <input type="date" v-model="form.date" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Название</label>
              <input type="text" v-model="form.name" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Категория</label>
              <select v-model="form.category" class="form-select" required>
                <option value="Продукты">Продукты</option>
                <option value="Развлечения">Развлечения</option>
                <option value="Транспорт">Транспорт</option>
                <option value="Покупки">Покупки</option>
                <option value="Зарплата">Зарплата</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Сумма (₽)</label>
              <input type="number" v-model="form.amount" class="form-control" min="1" required>
            </div>
            <button type="submit" class="btn btn-success w-100">Сохранить</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

const emit = defineEmits(['add-tx'])

const form = reactive({
  type: 'expense',
  date: '',
  name: '',
  category: 'Продукты',
  amount: ''
})

onMounted(() => {
  form.date = new Date().toISOString().split('T')[0]
})

const submitForm = () => {
  let amount = parseFloat(form.amount)
  if (form.type === 'expense') amount = -Math.abs(amount)
  else amount = Math.abs(amount)

  emit('add-tx', {
    date: form.date,
    name: form.name,
    category: form.category,
    amount: amount
  })
  
  // Reset form basics
  form.name = ''
  form.amount = ''
  document.getElementById('close-modal-btn').click()
}
</script>