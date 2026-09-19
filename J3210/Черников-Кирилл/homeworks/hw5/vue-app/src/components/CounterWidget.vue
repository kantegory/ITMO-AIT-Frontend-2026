<template>
  <div class="card">
    <span class="badge">Компонент: реактивность</span>
    <h3>Счётчик задач</h3>
    <div class="counter-value">{{ count }}</div>
    <p style="color:#667085;font-size:0.85rem;margin:0">
      {{ count === 0 ? 'Задач нет' : count === 1 ? '1 задача' : `${count} задачи` }}
    </p>
    <div class="btn-row">
      <button class="btn-primary" @click="count++">+ Добавить</button>
      <button class="btn-secondary" :disabled="count === 0" @click="count--">− Убрать</button>
      <button class="btn-danger" :disabled="count === 0" @click="count = 0">Сброс</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>
