<script setup>
defineProps(['items'])
</script>

<template>
  <div class="dashboard-card">
    <h3>Мои счета</h3>
    <div v-for="item in items" :key="item.id" class="account-box">
      <div>
        <strong>{{ item.title }}</strong>
        <p>{{ item.type }}</p>
      </div>
      <span>{{ item.balance }} ₽</span>
    </div>
  </div>
</template>