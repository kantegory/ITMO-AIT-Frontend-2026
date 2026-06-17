<template>
  <article class="account-card card border-0 shadow-sm h-100">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start gap-3">
        <div>
          <p class="text-secondary small mb-1">{{ account.typeTitle }}</p>
          <h3 class="h5 mb-0">{{ account.name }}</h3>
        </div>
        <IconSprite :name="iconName" />
      </div>
      <div class="account-balance mt-4">{{ formatMoney(account.currentBalance, account.currency) }}</div>
      <div class="small text-secondary mt-2">Начальный баланс: {{ formatMoney(account.initialBalance, account.currency) }}</div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import IconSprite from './IconSprite.vue';

const props = defineProps({
  account: {
    type: Object,
    required: true
  },
  formatMoney: {
    type: Function,
    required: true
  }
});

const iconName = computed(() => ({
  card: 'credit-card',
  savings: 'piggy-bank',
  cash: 'cash-coin',
  investment: 'graph-up-arrow'
})[props.account.type] || 'wallet2');
</script>
