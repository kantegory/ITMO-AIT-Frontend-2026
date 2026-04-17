<template>
  <div class="table-responsive">
    <table class="table align-middle">
      <caption class="visually-hidden">Таблица транзакций пользователя</caption>
      <thead>
        <tr>
          <th scope="col">Дата</th>
          <th scope="col">Категория</th>
          <th scope="col">Описание</th>
          <th scope="col">Тип</th>
          <th scope="col" class="text-end">Сумма</th>
          <th v-if="showDelete" scope="col" class="text-end">Действие</th>
        </tr>
      </thead>
      <tbody v-if="items.length">
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.date }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.description }}</td>
          <td>
            <span class="badge rounded-pill" :class="item.type === 'income' ? 'text-bg-success' : 'text-bg-light'">
              {{ item.type === 'income' ? 'Доход' : 'Расход' }}
            </span>
          </td>
          <td
            class="text-end fw-semibold"
            :class="item.type === 'income' ? 'text-success' : 'text-danger'"
          >
            {{ item.type === 'income' ? '+' : '-' }} {{ formatMoney(Math.abs(Number(item.amount || 0))) }}
          </td>
          <td v-if="showDelete" class="text-end">
            <button
              type="button"
              class="btn btn-sm btn-outline-danger rounded-pill px-3"
              @click="emit('delete', item)"
            >
              Удалить
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="!items.length" class="empty-state mt-3">
    По выбранным параметрам ничего не найдено.
  </div>
</template>

<script setup>
import { formatMoney } from '@/utils'

defineProps({
  items: {
    type: Array,
    default: () => []
  },
  showDelete: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete'])
</script>
