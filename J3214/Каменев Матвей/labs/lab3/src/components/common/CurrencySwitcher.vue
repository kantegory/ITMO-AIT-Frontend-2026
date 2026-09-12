<script setup>
import useCurrency from '@/composables/useCurrency'

const { currency, ratesLoaded, setCurrency } = useCurrency()

const options = [
  { id: 'cur-rub', value: 'RUB', symbol: '₽' },
  { id: 'cur-usd', value: 'USD', symbol: '$' },
  { id: 'cur-eur', value: 'EUR', symbol: '€' },
]
</script>

<template>
  <div class="btn-group" role="group" aria-label="Валюта">
    <template v-for="option in options" :key="option.value">
      <input
        type="radio"
        class="btn-check"
        name="currency"
        :id="option.id"
        :value="option.value"
        :checked="currency === option.value"
        :disabled="option.value !== 'RUB' && !ratesLoaded"
        @change="setCurrency(option.value)"
      />
      <label class="btn btn-outline-secondary" :for="option.id">{{ option.symbol }}</label>
    </template>
  </div>
</template>
