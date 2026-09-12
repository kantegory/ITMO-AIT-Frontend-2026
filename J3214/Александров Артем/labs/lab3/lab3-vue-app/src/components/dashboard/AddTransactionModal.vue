<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop fade show" style="z-index: 1050;"></div>
    <div 
      v-if="isOpen" 
      class="modal d-block fade show" 
      tabindex="-1" 
      style="z-index: 1055; background: rgba(0,0,0,0.5);"
      @click.self="close"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content theme-card rounded-4 shadow p-2">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold theme-text-main">Добавить транзакцию</h5>
            <button type="button" class="btn-close" aria-label="Закрыть" @click="close"></button>
          </div>
          <div class="modal-body pt-3">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label small theme-text-muted fw-medium">Название операции</label>
                <input 
                  v-model.trim="form.title" 
                  type="text" 
                  class="form-control py-2 shadow-none" 
                  placeholder="Например: Супермаркет" 
                  required 
                />
              </div>
              <div class="mb-3">
                <label class="form-label small theme-text-muted fw-medium">Сумма (со знаком - для расхода)</label>
                <input 
                  v-model.number="form.amount" 
                  type="number" 
                  step="0.01" 
                  class="form-control py-2 shadow-none" 
                  placeholder="-100.00 / 100.00" 
                  required 
                />
              </div>
              <div class="mb-3">
                <label class="form-label small theme-text-muted fw-medium">Категория</label>
                <select v-model="form.category" class="form-select py-2 shadow-none">
                  <option value="Еда и продукты">Еда и продукты</option>
                  <option value="Кафе и рестораны">Кафе и рестораны</option>
                  <option value="Доходы">Доходы / Переводы</option>
                  <option value="Покупки">Покупки</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-100 rounded-3 py-2 mt-3 fw-medium">Сохранить</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  title: '',
  amount: '',
  category: 'Еда и продукты'
})

const close = () => {
  emit('close')
}

const handleSubmit = () => {
  emit('submit', {
    title: form.value.title,
    amount: Number(form.value.amount),
    category: form.value.category
  })
  form.value = { title: '', amount: '', category: 'Еда и продукты' }
}
</script>