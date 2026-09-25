<template>
  <div class="card text-white bg-dark h-100 shadow p-3">
    <div class="card-body d-flex flex-column justify-content-between">
      <p class="text-uppercase mb-2">{{ name }}</p>
      <h3 class="fw-bold mb-0">
        {{ balance < 0 ? '− ' : '' }}{{ Math.abs(balance).toLocaleString('ru-RU') }} ₽
      </h3>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountCard',
  props: {
    name: { type: String, required: true },
    type: { type: String, required: true },
    balance: { type: Number, required: true }
  }
}
</script>
