<template>
  <AppModal :model-value="modelValue" title="Подключение банка" @update:model-value="$emit('update:modelValue', $event)">
    <form @submit.prevent="onSubmit">
      <div class="modal-body">
        <p class="text-muted small">Выберите банк для подключения. Данные передаются по защищённому соединению.</p>
        <select v-model="bank" class="form-select mb-3">
          <option v-for="b in banks" :key="b">{{ b }}</option>
        </select>
        <div class="form-check">
          <input id="bankAgree" v-model="agree" class="form-check-input" type="checkbox" />
          <label class="form-check-label small" for="bankAgree">Согласен с условиями передачи данных</label>
        </div>
        <div v-if="error" class="text-danger small mt-1">Необходимо принять условия</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="$emit('update:modelValue', false)">Отмена</button>
        <button type="submit" class="btn btn-primary">Подключить</button>
      </div>
    </form>
  </AppModal>
</template>

<script setup>
import { ref } from 'vue'
import AppModal from './AppModal.vue'

defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue', 'submit'])

const banks = ['Сбер', 'Олег Т-Банк', 'ВТБ', 'Альфа-Банк']
const bank = ref(banks[0])
const agree = ref(false)
const error = ref(false)

function onSubmit() {
  if (!agree.value) {
    error.value = true
    return
  }
  error.value = false
  emit('submit', bank.value)
  agree.value = false
  emit('update:modelValue', false)
}
</script>
