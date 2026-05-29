<script setup>
import { ref } from 'vue'

const items = ref(['Изучить npm', 'Создать Vue-проект', 'Сделать компоненты'])
const newItem = ref('')

function add() {
  if (newItem.value.trim()) {
    items.value.push(newItem.value.trim())
    newItem.value = ''
  }
}

function remove(index) {
  items.value.splice(index, 1)
}
</script>

<template>
  <div class="todo">
    <h2>Список задач</h2>
    <div class="input-row">
      <input v-model="newItem" @keyup.enter="add" placeholder="Новая задача..." />
      <button @click="add">Добавить</button>
    </div>
    <ul>
      <li v-for="(item, i) in items" :key="i">
        {{ item }}
        <button @click="remove(i)">✕</button>
      </li>
    </ul>
    <p v-if="items.length === 0" class="empty">Список пуст</p>
  </div>
</template>

<style scoped>
.todo { border: 1px solid #ccc; border-radius: 8px; padding: 16px; }
.input-row { display: flex; gap: 8px; margin-bottom: 12px; }
input { flex: 1; padding: 6px 10px; border: 1px solid #aaa; border-radius: 4px; }
ul { list-style: none; padding: 0; margin: 0; }
li { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #eee; }
button { padding: 4px 10px; cursor: pointer; border-radius: 4px; border: 1px solid #aaa; }
.empty { color: #999; }
</style>
