<template>
  <div class="theme-card p-4 shadow-sm border-0 theme-border rounded-4 h-100 d-flex flex-column justify-content-between">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex align-items-center gap-2">
        <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center" style="width: 36px; height: 36px;">
          <i class="bi bi-currency-exchange fs-5"></i>
        </div>
        <div>
          <h3 class="h6 fw-bold m-0">Курсы валют</h3>
          <span class="theme-text-muted" style="font-size: 11px;">Курс к USD на момент последнего обновления</span>
        </div>
      </div>
      <button class="btn theme-bg-secondary theme-text-main rounded-circle d-flex align-items-center justify-content-center p-0" style="width: 32px; height: 32px;" aria-label="Обновить" @click="fetchRates">
        <i class="bi bi-arrow-clockwise text-secondary" :class="{ 'spin-icon': isLoading }"></i>
      </button>
    </div>

    <div class="row g-3 my-auto">
      <div v-for="curr in currencyRates" :key="curr.code" class="col-6 col-md-3">
        <div class="p-3 theme-bg-secondary rounded-3 text-center border-0 h-100 d-flex flex-column justify-content-center">
          <div class="fs-4 mb-1">{{ curr.flag }}</div>
          <div class="fw-bold theme-text-main" style="font-size: 15px;">1 USD</div>
          <div class="fw-bold" style="color: #0f43c4; font-size: 26px;">{{ curr.rate }} {{ curr.symbol }}</div>
          <div class="theme-text-muted" style="font-size: 11px;">{{ curr.name }}</div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center pt-3 mt-2" style="font-size: 11px;">
      <span class="theme-text-muted">Источник: ExchangeRate API</span>
      <span class="theme-text-muted">Обновлено: {{ lastUpdate }}</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCurrency } from '@/composables/useCurrency'

const { currencyRates, lastUpdate, isLoading, fetchRates } = useCurrency()

onMounted(() => {
  fetchRates()
})
</script>

<style scoped>
.spin-icon {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>