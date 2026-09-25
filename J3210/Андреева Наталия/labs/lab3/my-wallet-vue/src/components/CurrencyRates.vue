<template>
  <section class="mb-5" v-if="rates">
    <h2 class="fw-bold mb-4 text-center text-muted h4">Мировые валюты</h2>

    <div class="row mb-3">
      <div class="col-12">
        <div id="rate-usd" class="card p-4 card-main-usd border-0 shadow text-center">
          <div class="mb-2">
            <svg class="svg-icon" style="width:2rem; height:2rem; margin:0;">
              <use href="/sprite.svg#curr-usd"></use>
            </svg>
          </div>
          <small class="text-uppercase fw-bold opacity-70">Курс Доллара (USD)</small>
          <h1 class="display-4 fw-bold mb-1">{{ rates.USD.Value.toFixed(2) }} ₽</h1>
          <div class="d-flex justify-content-center">
            <span class="badge" :class="rates.USD.Value > rates.USD.Previous ? 'badge-soft-amber' : 'badge-soft-info'">
              {{ rates.USD.Value > rates.USD.Previous ? '▲' : '▼' }}
              {{ Math.abs(rates.USD.Value - rates.USD.Previous).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-3">
      <div class="col-md-4" v-for="code in ['EUR', 'CNY', 'GBP']" :key="code">
        <div :id="'rate-' + code.toLowerCase()" class="card p-3 currency-tinted border-0 text-center fw-bold h-100">
          <small class="text-muted d-block mb-1">{{ code }}</small>
          <div class="d-flex align-items-center justify-content-center">
            <svg class="svg-icon" style="width:1rem; height:1rem; margin-right:5px; stroke-width:3;">
              <use :href="`/sprite.svg#curr-${code.toLowerCase()}`"></use>
            </svg>
            <span>{{ rates[code].Value.toFixed(2) }} ₽</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-6 col-md-3" v-for="code in ['JPY', 'TRY', 'KZT', 'AMD']" :key="code">
        <div :id="'rate-' + code.toLowerCase()" class="card p-3 currency-tinted border-0 text-center fw-bold h-100">
          <small class="text-muted d-block mb-1">{{ code }}</small>
          <div class="d-flex align-items-center justify-content-center">
            <svg class="svg-icon" style="width:1rem; height:1rem; margin-right:5px; stroke-width:3;">
              <use :href="`/sprite.svg#curr-${code.toLowerCase()}`"></use>
            </svg>
            <span>{{ rates[code].Value.toFixed(2) }} ₽</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {onMounted} from 'vue'
import {useCurrency} from '../composables/useCurrency'

const {rates, fetchRates} = useCurrency()
onMounted(fetchRates)
</script>