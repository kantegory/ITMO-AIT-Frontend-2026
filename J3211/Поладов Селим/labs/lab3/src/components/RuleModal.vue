<template>
  <AppModal :model-value="modelValue" title="Новое правило" @update:model-value="$emit('update:modelValue', $event)">
    <form @submit.prevent="onSubmit">
      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label">Условие</label>
          <select v-model="form.condition" class="form-select">
            <option v-for="c in conditions" :key="c">{{ c }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Значение</label>
          <input v-model="form.value" type="text" class="form-control" placeholder="Текст или число" required />
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
        <button type="submit" class="btn btn-primary">Создать правило</button>
      </div>
    </form>
  </AppModal>
</template>

<script setup>
import { reactive } from 'vue'
import AppModal from './AppModal.vue'

defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue', 'submit'])

const conditions = ['Контрагент содержит', 'Сумма больше', 'Сумма меньше', 'Комментарий содержит']
const categories = ['Продукты', 'Транспорт', 'Развлечения', 'Жильё', 'Техника', 'Авто', 'Крупные траты', 'Доход']
const form = reactive({ condition: conditions[0], value: '', category: categories[0] })

function reset() {
  form.condition = conditions[0]
  form.value = ''
  form.category = categories[0]
}

function onSubmit() {
  emit('submit', { ...form })
  reset()
  emit('update:modelValue', false)
}
</script>
