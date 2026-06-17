<script setup>
const STATUS_LABELS = {
  success: 'Успешно',
  running: 'Запущен',
  failed: 'Ошибка',
  pending: 'Ожидание'
};

const props = defineProps({
  status: { type: String, required: true }
});
</script>

<template>
  <span :class="['status-badge', `status-${props.status}`]">
    {{ STATUS_LABELS[props.status] || props.status }}
  </span>
</template>
