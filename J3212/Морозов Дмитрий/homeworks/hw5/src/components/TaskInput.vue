<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add-task'])

const taskText = ref('')

function submitTask() {
  const trimmedText = taskText.value.trim()

  if (!trimmedText) {
    return
  }

  emit('add-task', trimmedText)
  taskText.value = ''
}
</script>

<template>
  <section class="panel">
    <h2>Добавить задачу</h2>
    <p>Запишите новое дело, чтобы не забыть о нем в течение дня.</p>

    <form class="task-form" @submit.prevent="submitTask">
      <input
        v-model="taskText"
        type="text"
        placeholder="Например, оплатить интернет"
      />
      <button type="submit">Добавить</button>
    </form>
  </section>
</template>

<style scoped>
.panel {
  padding: 1.5rem;
  border: 1px solid #dbe3ef;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

h2 {
  margin: 0 0 0.5rem;
  color: #0f172a;
}

p {
  margin: 0 0 1rem;
  color: #64748b;
  line-height: 1.6;
}

.task-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
}

input {
  width: 100%;
  padding: 0.95rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  color: #0f172a;
  font: inherit;
}

input:focus {
  outline: 2px solid #fb923c;
  outline-offset: 2px;
}

button {
  padding: 0.95rem 1.2rem;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 700px) {
  .task-form {
    grid-template-columns: 1fr;
  }
}
</style>
