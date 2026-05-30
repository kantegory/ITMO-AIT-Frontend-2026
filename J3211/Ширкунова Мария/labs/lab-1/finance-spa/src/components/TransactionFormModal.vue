<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['submit'])

const form = reactive({
  transType: 'expense',
  accountName: 'Зарплатная карта',
  description: '',
  amount: '',
  category: 'food'
})

const onSubmit = () => {
  emit('submit', { ...form })
  // сброс
  form.description = ''
  form.amount = ''
}
</script>

<template>
  <div class="modal fade" id="addTransactionModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Новая транзакция</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label class="form-label">Тип операции</label>
              <div class="d-flex gap-3">
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="typeExpense"
                         value="expense" v-model="form.transType">
                  <label class="form-check-label text-danger" for="typeExpense">Расход</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="typeIncome"
                         value="income" v-model="form.transType">
                  <label class="form-check-label text-success" for="typeIncome">Доход</label>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Счёт</label>
              <select class="form-select" v-model="form.accountName">
                <option>Зарплатная карта</option>
                <option>Наличные</option>
                <option>Кредитная карта</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Описание</label>
              <input class="form-control" v-model="form.description" required>
            </div>

            <div class="mb-3">
              <label class="form-label">Сумма (₽)</label>
              <input type="number" class="form-control" v-model="form.amount" required>
            </div>

            <div class="mb-3">
              <label class="form-label">Категория</label>
              <select class="form-select" v-model="form.category">
                <option value="food">Супермаркеты</option>
                <option value="transport">Транспорт</option>
                <option value="income">Зарплата</option>
                <option value="transfers">Переводы</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary w-100"
                    data-bs-dismiss="modal">Сохранить</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
