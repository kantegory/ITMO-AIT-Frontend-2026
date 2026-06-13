<script setup>
defineProps(['item'])
</script>

<template>
  <div class="dashboard-card integration-card">
    <h3>{{ item.name }}</h3>
    <p>{{ item.description }}</p>
    <button class="btn btn-main">
      {{ item.connected ? 'Отключить' : 'Подключить' }}
    </button>
  </div>
</template>