<template>
  <AppModal :model-value="modelValue" title="Добавить транзакцию" @update:model-value="$emit('update:modelValue', $event)">
    <form @submit.prevent="onSubmit">
      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label">Название</label>
          <input v-model="form.name" type="text" class="form-control" placeholder="Например: Продукты" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Контрагент</label>
          <input v-model="form.counterparty" type="text" class="form-control" placeholder="Магазин, компания..." />
        </div>
        <div class="mb-3">
          <label class="form-label">Сумма, ₽</label>
          <input v-model.number="form.amount" type="number" class="form-control" placeholder="0" min="1" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Категория</label>
          <select v-model="form.category" class="form-select">
            <option v-for="c in categories" :key="c">{{ c }}</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="$emit('update:modelValue', false)">Отмена</button>
        <button type="submit" class="btn btn-primary">Добавить</button>
      </div>
    </form>
  </AppModal>
</template>

<script setup>
import { reactive } from 'vue'
import AppModal from './AppModal.vue'

defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue', 'submit'])

const categories = ['Продукты', 'Транспорт', 'Развлечения', 'Жильё', 'Техника', 'Авто', 'Накопления', 'Доход']
const form = reactive({ name: '', counterparty: '', amount: null, category: categories[0] })

function reset() {
  form.name = ''
  form.counterparty = ''
  form.amount = null
  form.category = categories[0]
}

function onSubmit() {
  emit('submit', { ...form })
  reset()
  emit('update:modelValue', false)
}
</script>
