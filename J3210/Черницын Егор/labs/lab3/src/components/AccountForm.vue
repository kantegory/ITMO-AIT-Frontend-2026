<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['submit'])

const form = reactive({
  name: '',
  type: 'Дебетовая карта',
  balance: '',
  currency: '₽',
})

function submit() {
  emit('submit', {
    name: form.name,
    type: form.type,
    balance: Number(form.balance),
    currency: form.currency,
  })

  form.name = ''
  form.type = 'Дебетовая карта'
  form.balance = ''
  form.currency = '₽'
}
</script>

<template>
  <form id="addAccountForm" @submit.prevent="submit">
    <div class="mb-3">
      <label class="form-label" for="newAccName">Название</label>
      <input
        id="newAccName"
        v-model="form.name"
        class="form-control"
        type="text"
        required
      />
    </div>

    <div class="mb-3">
      <label class="form-label" for="newAccType">Тип счета</label>
      <select id="newAccType" v-model="form.type" class="form-select">
        <option>Дебетовая карта</option>
        <option>Кредитная карта</option>
        <option>Накопительный счет</option>
        <option>Наличные</option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label" for="newAccBalance">Начальный баланс</label>
      <input
        id="newAccBalance"
        v-model="form.balance"
        class="form-control"
        type="number"
        min="0"
        required
      />
    </div>

    <div class="mb-4">
      <label class="form-label" for="newAccCurr">Валюта</label>
      <select id="newAccCurr" v-model="form.currency" class="form-select">
        <option value="₽">₽ RUB</option>
        <option value="$">$ USD</option>
        <option value="€">€ EUR</option>
      </select>
    </div>

    <button class="btn btn-custom w-100 rounded-pill" type="submit">
      Сохранить счет
    </button>
  </form>
</template>
