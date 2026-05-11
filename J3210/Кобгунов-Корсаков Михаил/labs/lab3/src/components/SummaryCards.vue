<script setup>
defineProps({
  summary: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="row g-3 mb-4">
    <div class="col-md-4">
      <div class="card text-center shadow-sm">
        <div class="card-body">
          <h3>Баланс</h3>
          <h4>{{ summary.balance }} ₽</h4>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card text-center shadow-sm">
        <div class="card-body">
          <h3>Доходы</h3>
          <h4 class="text-success">+{{ summary.income }} ₽</h4>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card text-center shadow-sm">
        <div class="card-body">
          <h3>Расходы</h3>
          <h4 class="text-danger">-{{ summary.expenses }} ₽</h4>
        </div>
      </div>
    </div>
  </div>
</template>
