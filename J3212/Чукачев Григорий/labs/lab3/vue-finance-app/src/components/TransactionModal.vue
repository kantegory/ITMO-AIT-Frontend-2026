<script setup>
import { ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['transaction-added'])

const type = ref('expense')
const category = ref('food')
const account = ref('Сбербанк (**** 4321)')
const title = ref('')
const amount = ref('')

const categoryNames = {
  food: "Продукты",
  transport: "Транспорт",
  entertainment: "Развлечения",
  salary: "Зарплата",
  other: "Разное"
}

const saveTransaction = async () => {
  if (!title.value || !amount.value) {
    alert("Заполните название и сумму!")
    return
  }

  const today = new Date().toISOString().split('T')[0]

  const newTransaction = {
    title: title.value,
    amount: Number(amount.value),
    type: type.value,
    date: today,
    category: category.value,
    categoryName: categoryNames[category.value]
  }

  try {
    const response = await axios.post('http://localhost:3000/transactions', newTransaction)
    if (response.status === 201 || response.status === 200) {
      title.value = ''
      amount.value = ''
      category.value = 'food'

      emit('transaction-added')
      alert("Операция успешно добавлена!")
    }
  } catch (error) {
    console.error(error)
    alert("Ошибка сохранения транзакции")
  }
}
</script>

<template>
  <div class="modal fade" id="addTransactionModal" tabindex="-1" aria-labelledby="addTransactionModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content" style="border-radius: 15px;">
        <header class="modal-header bg-success text-white" style="border-radius: 15px 15px 0 0;">
          <h2 class="modal-title h5" id="addTransactionModalLabel"><i class="bi bi-cash-coin me-2"></i> Новая транзакция</h2>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Закрыть окно"></button>
        </header>
        <div class="modal-body">
          <form @submit.prevent="saveTransaction">
            <div class="mb-3">
              <label for="dashTxType" class="form-label">Тип операции</label>
              <select class="form-select" id="dashTxType" v-model="type">
                <option value="expense">Расход</option>
                <option value="income">Доход</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="dashTxCategory" class="form-label">Категория</label>
              <select class="form-select" id="dashTxCategory" v-model="category">
                <option value="food">Продукты</option>
                <option value="transport">Транспорт</option>
                <option value="entertainment">Развлечения</option>
                <option value="salary">Зарплата</option>
                <option value="other">Разное</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="dashTxAccount" class="form-label">Счет списания/зачисления</label>
              <select class="form-select" id="dashTxAccount" v-model="account">
                <option>Сбербанк (**** 4321)</option>
                <option>Т-Банк (**** 1234)</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="dashTxTitle" class="form-label">Название</label>
              <input type="text" class="form-control" id="dashTxTitle" placeholder="Например: Покупка кофе" required v-model="title">
            </div>

            <div class="mb-3">
              <label for="dashTxAmount" class="form-label">Сумма (₽)</label>
              <input type="number" class="form-control" id="dashTxAmount" placeholder="1000" required v-model="amount">
            </div>

            <footer class="modal-footer px-0 pb-0 border-0 mt-4">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
              <button type="submit" class="btn btn-success" data-bs-dismiss="modal">
                <i class="bi bi-check-lg me-1"></i> Добавить
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
