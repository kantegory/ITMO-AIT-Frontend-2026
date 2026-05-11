<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  short: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header">
      {{ short ? 'Последние транзакции' : 'Список транзакций' }}
    </div>

    <div class="table-responsive">
      <table class="table table-striped mb-0">
        <caption class="visually-hidden">Список транзакций пользователя</caption>

        <thead>
          <tr>
            <th scope="col">Дата</th>
            <th scope="col">Категория</th>
            <th v-if="!short" scope="col">Описание</th>
            <th scope="col">Сумма</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td :colspan="short ? 3 : 4" class="text-center">Загрузка...</td>
          </tr>

          <tr v-else-if="error">
            <td :colspan="short ? 3 : 4" class="text-center text-danger">{{ error }}</td>
          </tr>

          <tr v-else-if="items.length === 0">
            <td :colspan="short ? 3 : 4" class="text-center">Ничего не найдено</td>
          </tr>

          <template v-else>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.date }}</td>
              <td>{{ item.category }}</td>
              <td v-if="!short">{{ item.description }}</td>
              <td :class="item.amount > 0 ? 'text-success' : 'text-danger'">
                {{ item.amount > 0 ? '+' : '' }}{{ item.amount }} ₽
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
