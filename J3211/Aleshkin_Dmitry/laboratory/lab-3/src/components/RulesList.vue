<template>
  <ul class="list-group">
    <li v-if="!rules.length" class="list-group-item text-muted">Правил пока нет</li>
    <li v-for="rule in rules" :key="rule.id" class="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <div class="fw-semibold">{{ rule.actionLabel }}: {{ rule.categoryName }}</div>
        <small class="text-muted">Если поле «{{ rule.field }}» {{ rule.operator }} «{{ rule.value }}»</small>
      </div>
      <span v-if="disabled" class="text-muted">Только просмотр</span>
      <button v-else class="btn btn-sm btn-outline-danger" @click="$emit('remove', rule.id)">Удалить</button>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  rules: { type: Array, default: () => [] },
  disabled: Boolean,
});

defineEmits(['remove']);
</script>
