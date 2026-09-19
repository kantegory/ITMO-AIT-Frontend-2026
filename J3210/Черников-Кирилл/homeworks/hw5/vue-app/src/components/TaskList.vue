<template>
  <div class="card">
    <span class="badge">Компонент: v-for, v-if, события</span>
    <h3>Список задач</h3>
    <form class="task-form" @submit.prevent="addTask">
      <input
        v-model="newTask"
        type="text"
        placeholder="Новая задача..."
        aria-label="Текст новой задачи"
        maxlength="80"
      />
      <button type="submit" class="btn-primary">Добавить</button>
    </form>

    <p v-if="tasks.length === 0" class="empty-state">Список пуст — добавьте первую задачу.</p>

    <ul v-else class="task-list">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="task-item"
        :class="{ done: task.done }"
      >
        <input
          :id="`task-${task.id}`"
          type="checkbox"
          v-model="task.done"
        />
        <label :for="`task-${task.id}`">{{ task.text }}</label>
        <button class="btn-danger" @click="removeTask(task.id)">✕</button>
      </li>
    </ul>

    <p v-if="tasks.length > 0" style="margin:0.75rem 0 0;font-size:0.8rem;color:#667085">
      Выполнено: {{ doneCount }} / {{ tasks.length }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const newTask = ref('')
const tasks = ref([
  { id: 1, text: 'Изучить основы Vue.js', done: true },
  { id: 2, text: 'Создать первый компонент', done: false },
])
let nextId = 3

const doneCount = computed(() => tasks.value.filter((t) => t.done).length)

function addTask() {
  const text = newTask.value.trim()
  if (!text) return
  tasks.value.push({ id: nextId++, text, done: false })
  newTask.value = ''
}

function removeTask(id) {
  tasks.value = tasks.value.filter((t) => t.id !== id)
}
</script>
