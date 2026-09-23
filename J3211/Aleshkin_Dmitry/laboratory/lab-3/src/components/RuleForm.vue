<template>
  <form class="row g-3 mb-3" @submit.prevent="submitForm">
    <div class="col-12">
      <label class="form-label">Поле для проверки</label>
      <select v-model="form.field" class="form-select" :disabled="disabled">
        <option value="Описание операции">Описание операции</option>
      </select>
    </div>
    <div class="col-12 col-md-4">
      <label class="form-label">Условие</label>
      <select v-model="form.operator" class="form-select" :disabled="disabled">
        <option value="содержит">содержит</option>
        <option value="равно">равно</option>
        <option value="начинается с">начинается с</option>
      </select>
    </div>
    <div class="col-12 col-md-8">
      <label class="form-label">Значение</label>
      <input v-model="form.value" class="form-control" placeholder="Например: Пятёрочка, Магнит" :disabled="disabled" required />
    </div>
    <div class="col-12 col-md-6">
      <label class="form-label">Что сделать</label>
      <select v-model="form.actionType" class="form-select" :disabled="disabled">
        <option value="category">Относить в категорию</option>
      </select>
    </div>
    <div class="col-12 col-md-6">
      <label class="form-label">Категория</label>
      <select v-model="form.categoryId" class="form-select" :disabled="disabled">
        <option v-for="item in categories.filter((entry) => entry.value !== 'income')" :key="item.value" :value="item.value">{{ item.label }}</option>
      </select>
    </div>
    <div class="col-12"><button class="btn btn-primary" type="submit" :disabled="disabled">Добавить правило</button></div>
  </form>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  categories: { type: Array, default: () => [] },
  disabled: Boolean,
});

const emit = defineEmits(['submit']);

const form = reactive({
  field: 'Описание операции',
  operator: 'содержит',
  value: '',
  actionType: 'category',
  categoryId: 'products',
});

function submitForm() {
  const categoryName = props.categories.find((item) => item.value === form.categoryId)?.label || '';
  emit('submit', {
    ...form,
    actionLabel: 'Относить в категорию',
    categoryName,
    active: true,
  });
  form.value = '';
  form.actionType = 'category';
  form.categoryId = 'products';
}
</script>
