<script setup>
import { computed, ref } from 'vue'

const newTask = ref('')
const tasks = ref([
  { id: 1, title: 'Проверить структуру проекта', done: true },
  { id: 2, title: 'Запустить приложение', done: false },
  { id: 3, title: 'Протестить калькулятор', done: false }
])

const completedCount = computed(() => tasks.value.filter((task) => task.done).length)

function addTask() {
  const title = newTask.value.trim()

  if (!title) return

  tasks.value.push({
    id: Date.now(),
    title,
    done: false
  })

  newTask.value = ''
}

function removeTask(id) {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}
</script>

<template>
  <div class="tasks-card">
    <form class="task-form" @submit.prevent="addTask">
      <input v-model="newTask" type="text" placeholder="Введите новую задачу" />
      <button type="submit">Добавить</button>
    </form>

    <p class="tasks-counter">Выполнено: {{ completedCount }} из {{ tasks.length }}</p>

    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id" :class="{ done: task.done }">
        <label>
          <input v-model="task.done" type="checkbox" />
          <span>{{ task.title }}</span>
        </label>
        <button type="button" class="delete-btn" @click="removeTask(task.id)">×</button>
      </li>
    </ul>
  </div>
</template>
