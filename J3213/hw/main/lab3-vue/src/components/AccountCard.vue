<script setup>
defineProps({
  account: { type: Object, required: true },
  formatMoney: { type: Function, required: true },
})
</script>

<template>
  <article class="account-card h-100">
    <p class="muted mb-2">{{ account.type }}</p>
    <h3 class="h5 mb-2">{{ account.name }}</h3>
    <p class="metric-value mb-1">{{ formatMoney(account.balance, account.currency) }}</p>
    <p class="small-note mb-0">Баланс обновляется из API</p>
  </article>
</template>
