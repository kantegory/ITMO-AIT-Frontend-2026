<template>
  <div class="currency-card">
    <div class="currency-card-header">{{ name.toUpperCase() }}</div>
    <div class="currency-card-body">
      <svg class="icon">
        <use :href="'/sprite.svg#icon-' + code.toLowerCase()"></use>
      </svg>
      <span>{{ code }}: {{ value.toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps(['code', 'name', 'value'])
</script>