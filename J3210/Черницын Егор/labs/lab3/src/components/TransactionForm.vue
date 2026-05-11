<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  accounts: {
    type: Array,
    default: () => [],
  },
  categories: {
    type: Array,
    default: () => [],
  },
  selectedAccountId: {
    type: [String, Number, null],
    default: null,
  },
})

const emit = defineEmits(['submit'])

const form = reactive({
  description: '',
  category: '',
  date: new Date().toISOString().slice(0, 10),
  accountId: '',
  type: 'expense',
  amount: '',
})

function resetForm() {
  form.description = ''
  form.category = ''
  form.date = new Date().toISOString().slice(0, 10)
  form.accountId = props.selectedAccountId || props.accounts[0]?.id || ''
  form.type = 'expense'
  form.amount = ''
}

watch(
  () => [props.selectedAccountId, props.accounts.length],
  resetForm,
  { immediate: true },
)

function submit() {
  emit('submit', {
    description: form.description,
    category: form.category,
    date: form.date,
    accountId: form.accountId,
    type: form.type,
    amount: Number(form.amount),
  })

  resetForm()
}
</script>

<template>
  <form id="addTransactionForm" @submit.prevent="submit">
    <div class="mb-3">
      <label class="form-label" for="newTransDesc">Описание</label>
      <input
        id="newTransDesc"
        v-model="form.description"
        class="form-control"
        type="text"
        required
      />
    </div>

    <div class="mb-3">
      <label class="form-label" for="newTransCategory">Категория</label>
      <input
        id="newTransCategory"
        v-model="form.category"
        class="form-control"
        list="categoryList"
        type="text"
        required
      />

      <datalist id="categoryList">
        <option v-for="category in categories" :key="category" :value="category" />
      </datalist>
    </div>

    <div class="mb-3">
      <label class="form-label" for="newTransDate">Дата</label>
      <input
        id="newTransDate"
        v-model="form.date"
        class="form-control"
        type="date"
        required
      />
    </div>

    <div class="mb-3">
      <label class="form-label" for="newTransAccount">Счёт</label>
      <select id="newTransAccount" v-model="form.accountId" class="form-select" required>
        <option v-for="account in accounts" :key="account.id" :value="account.id">
          {{ account.name }} — {{ account.balance }} {{ account.currency }}
        </option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label" for="newTransType">Операция</label>
      <select id="newTransType" v-model="form.type" class="form-select">
        <option value="expense">Расход</option>
        <option value="income">Доход</option>
      </select>
    </div>

    <div class="mb-4">
      <label class="form-label" for="newTransAmount">Сумма</label>
      <input
        id="newTransAmount"
        v-model="form.amount"
        class="form-control"
        type="number"
        min="1"
        required
      />
    </div>

    <button class="btn btn-custom w-100 rounded-pill" type="submit">
      Сохранить транзакцию
    </button>
  </form>
</template>
