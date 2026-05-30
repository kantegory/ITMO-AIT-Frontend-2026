<script setup>
const props = defineProps({
  name: String,
  type: String,
  balance: Number
})
</script>

<template>
  <article class="col-md-4 mb-3">
    <div :class="['card', 'account-card', `account-card--${type}`, 'h-100', 'shadow']">
      <div class="card-body p-4 d-flex flex-column justify-content-between">
        <p class="account-card__label">{{ name }}</p>
        <h3 class="fw-bold mb-0">
          {{ balance < 0 ? '- ' : '' }}{{ Math.abs(balance).toLocaleString('ru-RU') }} ₽
        </h3>
      </div>
    </div>
  </article>
</template>
