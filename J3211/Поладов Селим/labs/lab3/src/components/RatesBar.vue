<template>
  <div class="content-card py-2 mb-4">
    <div class="d-flex flex-wrap gap-4 align-items-center">
      <span class="text-muted small fw-medium">Курсы валют</span>
      <span class="small">🇺🇸 USD → <strong>{{ usdRub != null ? usdRub.toFixed(2) : '—' }}</strong> ₽</span>
      <span class="small">🇪🇺 EUR → <strong>{{ eurRub != null ? eurRub.toFixed(2) : '—' }}</strong> ₽</span>
      <span class="small text-muted ms-auto">{{ date ? 'на ' + date : '' }}</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCurrencyRates } from '../composables/useCurrencyRates.js'

const { usdRub, eurRub, date, load } = useCurrencyRates()
onMounted(load)
</script>
