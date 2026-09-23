<template>
  <ul class="list-group">
    <li
      v-for="account in accounts"
      :key="account.id"
      class="list-group-item d-flex justify-content-between align-items-center"
    >
      <div>
        <strong>{{ account.name }}</strong>
        <div class="small text-muted">{{ account.bank }}</div>
      </div>
      <span>{{ formatCurrency(account.balance) }}</span>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  accounts: {
    type: Array,
    default: () => [],
  },
  formatCurrency: {
    type: Function,
    required: true,
  },
});
</script>