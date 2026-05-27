<script setup>
defineProps({ account: Object })
</script>

<template>
  <div class="col-md-6">
    <div class="card p-3">
      <div class="fw-semibold">{{ account.name }}</div>
      <div class="text-muted small">•••• {{ account.mask }}</div>
      <div class="mt-2 fw-bold">{{ account.balance.toLocaleString('ru-RU') }} ₽</div>
    </div>
  </div>
</template>
