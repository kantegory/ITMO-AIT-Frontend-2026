<template>
  <div class="col-md-4">
    <div class="account-card" role="listitem" :aria-label="`${account.name}, баланс ${formatCurrency(account.balance)}`">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <small>{{ account.name }}</small>
          <h3>{{ formatCurrency(account.balance) }}</h3>
        </div>
        <SvgIcon :name="getAccountIcon(account.type)" class-name="icon--sm" />
      </div>
      <p class="mb-0 text-secondary small">{{ account.description || account.provider || "Подключено через API" }}</p>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from "@/components/SvgIcon.vue";
import { formatCurrency } from "@/utils/formatters";
import { getAccountIcon } from "@/utils/financeMetrics";

defineProps({
  account: {
    type: Object,
    required: true,
  },
});
</script>

