<template>
  <div class="theme-card p-4 shadow-sm border-0 theme-border rounded-4 h-100">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="h6 fw-bold m-0">Моя карта</h3>
      <i class="bi bi-three-dots theme-text-muted" style="cursor: pointer;"></i>
    </div>

    <div class="p-4 rounded-4 text-white shadow-sm position-relative overflow-hidden" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
      <div class="d-flex justify-content-between align-items-start mb-4">
        <div>
          <p class="text-white-50 small mb-1">Баланс</p>
          <h4 class="fw-bold m-0">${{ balance.toFixed(2) }}</h4>
        </div>
        <i class="bi bi-wifi fs-4 text-white-50" style="transform: rotate(90deg);"></i>
      </div>
      <p class="mb-4 text-white-50" style="letter-spacing: 3px; font-family: monospace;">**** **** **** 1234</p>
      <div class="d-flex justify-content-between align-items-end">
        <span class="small text-white-50 fw-medium">{{ userName || 'Пользователь' }}</span>
        <i class="bi bi-credit-card-2-back fs-2 lh-1 text-white-50"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  balance: {
    type: Number,
    default: 0
  },
  userName: {
    type: String,
    default: 'Пользователь'
  }
})
</script>