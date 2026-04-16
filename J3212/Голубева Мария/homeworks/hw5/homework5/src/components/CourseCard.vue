<template>
  <div class="card">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <button>Записаться</button>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String
})
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 280px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.card h2 {
  color: #4da6ff;
}

button {
  margin-top: 15px;
  background: #4da6ff;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
}
</style>