<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  ticket: {
    type: Object,
    default: null,
  },
  submitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'submit'])
const reason = ref('')
const touched = ref(false)

watch(
  () => props.ticket,
  () => {
    reason.value = ''
    touched.value = false
  },
)

function handleSubmit() {
  touched.value = true
  if (!reason.value.trim()) {
    return
  }

  emit('submit', reason.value)
}
</script>

<template>
  <div v-if="ticket" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content" novalidate @submit.prevent="handleSubmit">
        <div class="modal-header">
          <h2 class="modal-title fs-5">Оформление возврата</h2>
          <button type="button" class="btn-close" aria-label="Закрыть" @click="emit('close')"></button>
        </div>
        <div class="modal-body">
          <p class="mb-2">Событие: <strong>{{ ticket.eventName }}</strong></p>
          <p class="mb-3">Заказ: <strong>#{{ ticket.id }}</strong></p>
          <label for="refundReason" class="form-label">Причина возврата</label>
          <textarea
            id="refundReason"
            v-model.trim="reason"
            class="form-control"
            :class="{ 'is-invalid': touched && !reason }"
            rows="3"
            required
            placeholder="Укажите причину"
          ></textarea>
          <div class="invalid-feedback">Пожалуйста, укажите причину возврата.</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="emit('close')">Отмена</button>
          <button type="submit" class="btn btn-danger" :disabled="submitting">Подтвердить возврат</button>
        </div>
      </form>
    </div>
  </div>
  <div v-if="ticket" class="modal-backdrop fade show"></div>
</template>
