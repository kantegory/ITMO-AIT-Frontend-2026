<script setup>
defineProps(['items'])
</script>

<template>
  <div class="dashboard-card">
    <h3>Бюджеты</h3>
    <div v-for="item in items" :key="item.id" class="budget-item">
      <div class="account-box">
        <div>
          <strong>{{ item.category }}</strong>
          <p>{{ item.spent }} / {{ item.limit }} ₽</p>
        </div>
      </div>
    </div>
  </div>
</template>