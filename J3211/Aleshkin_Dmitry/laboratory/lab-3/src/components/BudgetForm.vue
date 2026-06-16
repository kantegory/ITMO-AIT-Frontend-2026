<template>
  <form class="row g-3 mb-3" @submit.prevent="submitForm">
    <div class="col-12 col-md-5">
      <label class="form-label">Категория</label>
      <select v-model="localForm.category" class="form-select" :disabled="disabled">
        <option v-for="category in categories" :key="category.value" :value="category.value">
          {{ category.label }}
        </option>
      </select>
    </div>

    <div class="col-12 col-md-4">
      <label class="form-label">Значение</label>
      <input
        v-model.number="localForm.limit"
        type="number"
        class="form-control"
        min="1"
        placeholder="Например, 15000"
        :disabled="disabled"
      />
    </div>

    <div class="col-12 col-md-3 d-flex align-items-end">
      <button class="btn btn-primary w-100" type="submit" :disabled="disabled">
        Сохранить бюджет
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Object,
    required: true,
  },
  disabled: Boolean,
});

const emit = defineEmits(['save']);

const localForm = reactive({
  id: '',
  category: 'products',
  limit: null,
});

watch(
  () => props.modelValue,
  (value) => {
    localForm.id = value.id || '';
    localForm.category = value.category || 'products';
    localForm.limit = value.limit ?? null;
  },
  { immediate: true, deep: true },
);

function submitForm() {
  const categoryName =
    props.categories.find((item) => item.value === localForm.category)?.label ||
    localForm.category;

  emit('save', {
    id: localForm.id,
    category: localForm.category,
    categoryName,
    limit: localForm.limit,
  });
}
</script>