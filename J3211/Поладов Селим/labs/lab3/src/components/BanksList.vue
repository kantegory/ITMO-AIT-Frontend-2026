<template>
  <p v-if="loading" class="text-muted small mb-0">Загрузка...</p>
  <p v-else-if="!banks.length" class="text-muted small mb-0">Нет подключённых банков</p>
  <div
    v-for="b in banks"
    :key="b.id"
    class="d-flex justify-content-between align-items-center py-2 border-bottom"
  >
    <div>
      <span class="fw-medium">{{ b.name }}</span>
      <span class="small text-muted ms-2">подключён {{ formatDate(b.connectedAt) }}</span>
    </div>
    <button type="button" class="btn btn-sm btn-outline-danger" @click="$emit('remove', b.id)">Отключить</button>
  </div>
</template>

<script setup>
import { useFormatters } from '../composables/useFormatters.js'

defineProps({
  banks: { type: Array, required: true },
  loading: { type: Boolean, default: false }
})
defineEmits(['remove'])

const { formatDate } = useFormatters()
</script>
