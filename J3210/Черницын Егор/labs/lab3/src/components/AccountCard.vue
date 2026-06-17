<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  account: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

defineEmits(['add-transaction'])

const router = useRouter()

function formatBalance(value) {
  return Number(value || 0).toLocaleString('ru-RU')
}
</script>

<template>
  <div class="col-md-6 col-lg-4">
    <article
      class="card shadow-sm border-0 rounded-4 h-100 p-2"
      :class="`acc-card-${index % 7}`"
    >
      <div class="card-body d-flex flex-column text-white">
        <div class="d-flex justify-content-between align-items-start mb-4">
          <span class="small fw-bold text-uppercase opacity-75">{{ account.name }}</span>

          <span class="badge text-light rounded-pill">{{ account.currency }}</span>
        </div>

        <h2
          class="fw-bolder mb-4 balance-amount"
          :data-balance="`${account.balance} ${account.currency}`"
        >
          {{ formatBalance(account.balance) }} {{ account.currency }}
        </h2>

        <div class="d-flex justify-content-between mt-auto">
          <button
            aria-label="Добавить транзакцию для этого счета"
            title="Добавить транзакцию"
            class="btn btn-sm btn-outline-light rounded-circle fw-bold p-0 d-flex align-items-center justify-content-center shadow-sm btn-add-acc"
            type="button"
            @click="$emit('add-transaction', account.id)"
          >
            +
          </button>

          <a
            :href="`transact.html?accountId=${account.id}`"
            aria-label="Просмотреть историю по этому счету"
            title="Просмотр истории"
            class="btn btn-sm btn-outline-light rounded-pill fw-bold px-3 d-flex align-items-center"
            @click.prevent="router.push({ name: 'transactions', query: { accountId: account.id } })"
          >
            История
          </a>
        </div>
      </div>
    </article>
  </div>
</template>
