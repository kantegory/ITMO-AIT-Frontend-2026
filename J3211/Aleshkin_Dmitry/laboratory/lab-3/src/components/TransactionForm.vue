<template>
  <div class="filter-box">
    <h2>Добавление транзакции</h2>
    <form @submit.prevent="submitForm">
      <div class="row g-3">
        <div class="col-12 col-md-6 col-lg-3">
          <label class="form-label">Счёт</label>
          <select v-model="form.accountId" class="form-select" :disabled="disabled" required>
            <option v-for="account in accounts" :key="account.id" :value="account.id">{{ account.name }} — {{ formatCurrency(account.balance, account.currency) }}</option>
          </select>
        </div>
        <div class="col-12 col-md-6 col-lg-2">
          <label class="form-label">Тип</label>
          <select v-model="form.type" class="form-select" :disabled="disabled">
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
        </div>
        <div class="col-12 col-md-6 col-lg-2">
          <label class="form-label">Сумма</label>
          <input v-model.number="form.amount" type="number" min="1" class="form-control" :disabled="disabled" required />
        </div>
        <div class="col-12 col-md-6 col-lg-2">
          <label class="form-label">Валюта</label>
          <select v-model="form.currency" class="form-select" :disabled="disabled">
            <option value="RUB">RUB</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div class="col-12 col-md-6 col-lg-3">
          <label class="form-label">Категория</label>
          <select v-model="form.category" class="form-select" :disabled="disabled">
            <option v-for="item in availableCategories" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </div>
        <div class="col-12 col-md-8">
          <label class="form-label">Описание</label>
          <input v-model="form.description" class="form-control" placeholder="Например: Пятёрочка" :disabled="disabled" required />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Дата</label>
          <input v-model="form.date" type="date" class="form-control" :disabled="disabled" required />
        </div>
        <div class="col-12">
          <button class="btn btn-primary" type="submit" :disabled="disabled || !accounts.length">Добавить транзакцию</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';

const props = defineProps({
  accounts: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  disabled: Boolean,
  formatCurrency: { type: Function, required: true },
});

const emit = defineEmits(['submit']);

const form = reactive({
  accountId: '',
  type: 'income',
  amount: null,
  currency: 'RUB',
  category: 'income',
  description: '',
  date: new Date().toISOString().slice(0, 10),
});

const availableCategories = computed(() => {
  return form.type === 'income'
    ? props.categories.filter((item) => item.value === 'income')
    : props.categories.filter((item) => item.value !== 'income');
});

watch(
  () => props.accounts,
  (items) => {
    if (!form.accountId && items.length) form.accountId = items[0].id;
  },
  { immediate: true },
);

watch(
  () => form.type,
  () => {
    form.category = availableCategories.value[0]?.value || '';
  },
  { immediate: true },
);

function submitForm() {
  const categoryName = availableCategories.value.find((item) => item.value === form.category)?.label || '';
  emit('submit', {
    accountId: form.accountId,
    type: form.type,
    currency: form.currency,
    category: form.category,
    categoryName,
    description: form.description.trim(),
    date: form.date,
    amount: Number(form.amount || 0),
  });

  form.amount = null;
  form.description = '';
  form.date = new Date().toISOString().slice(0, 10);
  form.type = 'income';
}
</script>
