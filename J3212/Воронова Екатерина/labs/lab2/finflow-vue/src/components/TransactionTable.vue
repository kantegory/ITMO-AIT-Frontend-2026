<script setup>
defineProps(['items'])
</script>

<template>
  <div class="dashboard-card">
    <table class="custom-table">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Категория</th>
          <th>Описание</th>
          <th>Тип</th>
          <th>Сумма</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.date }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.amount }} ₽</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>