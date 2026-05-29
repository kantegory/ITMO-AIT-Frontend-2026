<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="counter">
    <h2>Счётчик</h2>
    <p>Значение: <strong>{{ count }}</strong></p>
    <button @click="count++">+</button>
    <button @click="count--">−</button>
    <button @click="count = 0">Сброс</button>
  </div>
</template>

<style scoped>
.counter { border: 1px solid #ccc; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
button { margin: 0 4px; padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #aaa; }
</style>
