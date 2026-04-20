<template>
  <div class="card mb-3 bg-dark text-light border-secondary">
    <div class="card-body d-flex justify-content-between align-items-center">
      <div>
        <h5 class="card-title mb-1">{{ description }}</h5>
        <h6 class="card-subtitle text-muted">{{ date }} • {{ category }}</h6>
      </div>
      <div>
        <h4 :class="amount < 0 ? 'text-danger' : 'text-success'" class="m-0">
          {{ amount }} ₽
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransactionCard',
  props: {
    description: { type: String, required: true },
    date: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true }
  }
}
</script>