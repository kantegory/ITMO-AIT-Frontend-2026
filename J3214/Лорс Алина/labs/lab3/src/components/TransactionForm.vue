<template>
  <form class="card border-0 shadow-sm" @submit.prevent="submit">
    <div class="card-body">
      <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label" for="transactionType">Тип</label>
          <select id="transactionType" v-model="form.type" class="form-select" required>
            <option value="expense">Расход</option>
            <option value="income">Доход</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label" for="transactionAccount">Счёт</label>
          <select id="transactionAccount" v-model="form.accountId" class="form-select" required>
            <option value="" disabled>Выберите счёт</option>
            <option v-for="account in accounts" :key="account.id" :value="account.id">{{ account.name }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label" for="transactionDate">Дата</label>
          <input id="transactionDate" v-model="form.date" type="date" class="form-control" required />
        </div>
        <div class="col-md-3">
          <label class="form-label" for="transactionAmount">Сумма</label>
          <input id="transactionAmount" v-model.number="form.amount" type="number" min="1" step="0.01" class="form-control" required />
        </div>
        <div class="col-md-6">
          <label class="form-label" for="transactionDescription">Описание</label>
          <input id="transactionDescription" v-model.trim="form.description" type="text" class="form-control" placeholder="Например, продукты" required />
        </div>
        <div class="col-md-3">
          <label class="form-label" for="transactionCategory">Категория</label>
          <select id="transactionCategory" v-model="form.category" class="form-select" required>
            <option v-for="category in currentCategories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button class="btn btn-primary w-100" type="submit">Добавить</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import { categories } from '../constants/finance';

const props = defineProps({
  accounts: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['submit']);

const today = new Date().toISOString().slice(0, 10);
const form = reactive({
  type: 'expense',
  accountId: '',
  date: today,
  description: '',
  category: categories.expense[0],
  amount: null,
  status: 'completed'
});

const currentCategories = computed(() => categories[form.type] || categories.expense);

watch(() => form.type, () => {
  form.category = currentCategories.value[0];
});

watch(() => props.accounts, (items) => {
  if (!form.accountId && items.length) form.accountId = items[0].id;
}, { immediate: true });

function submit() {
  emit('submit', { ...form });
  form.description = '';
  form.amount = null;
}
</script>
