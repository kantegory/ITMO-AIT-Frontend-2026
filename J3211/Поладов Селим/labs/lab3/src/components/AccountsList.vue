<template>
  <ul class="list-unstyled mb-0">
    <li v-if="loading" class="text-center text-muted py-3">Загрузка...</li>
    <li v-else-if="!accounts.length" class="text-center text-muted py-3">Нет счетов</li>
    <li
      v-for="a in accounts"
      :key="a.id"
      class="d-flex justify-content-between align-items-center py-2 border-bottom"
    >
      <div>
        <div class="fw-medium">{{ a.name }}</div>
        <div class="small text-muted">{{ a.currency }}</div>
      </div>
      <div class="fw-bold">{{ a.balance.toLocaleString('ru-RU') }} ₽</div>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  accounts: { type: Array, required: true },
  loading: { type: Boolean, default: false }
})
</script>
