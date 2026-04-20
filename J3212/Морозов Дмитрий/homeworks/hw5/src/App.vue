<script setup>
import { computed, ref } from 'vue'
import TaskInput from './components/TaskInput.vue'
import TaskList from './components/TaskList.vue'

const tasks = ref([
  { id: 1, text: 'Купить продукты на ужин', done: true },
  { id: 2, text: 'Позвонить в сервис и записаться на пятницу', done: false },
  { id: 3, text: 'Подготовить документы для встречи', done: false },
])

const nextId = ref(4)

const totalTasks = computed(() => tasks.value.length)
const completedTasks = computed(() => tasks.value.filter((task) => task.done).length)

function addTask(taskText) {
  tasks.value.unshift({
    id: nextId.value++,
    text: taskText,
    done: false,
  })
}

function toggleTask(taskId) {
  const task = tasks.value.find((item) => item.id === taskId)

  if (task) {
    task.done = !task.done
  }
}

function removeTask(taskId) {
  tasks.value = tasks.value.filter((task) => task.id !== taskId)
}
</script>

<template>
  <main class="page">
    <section class="hero">
      <p class="eyebrow">План на день</p>
      <h1>Список дел</h1>
    </section>

    <section class="dashboard">
      <article class="summary-card">
        <span>Всего задач</span>
        <strong>{{ totalTasks }}</strong>
      </article>
      <article class="summary-card">
        <span>Выполнено</span>
        <strong>{{ completedTasks }}</strong>
      </article>
    </section>

    <TaskInput @add-task="addTask" />

    <TaskList
      :tasks="tasks"
      @toggle-task="toggleTask"
      @remove-task="removeTask"
    />
  </main>
</template>

<style scoped>
.page {
  display: grid;
  gap: 1.5rem;
}

.hero {
  padding: 2rem;
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(255, 184, 108, 0.35), transparent 35%),
    linear-gradient(135deg, #0f172a, #1e293b);
  color: #f8fafc;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: #fdba74;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.05;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.summary-card {
  padding: 1.25rem 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.summary-card span {
  display: block;
  margin-bottom: 0.35rem;
  color: #64748b;
  font-size: 0.95rem;
}

.summary-card strong {
  color: #0f172a;
  font-size: 2rem;
}

@media (max-width: 700px) {
  .hero,
  .summary-card {
    border-radius: 20px;
  }

  .dashboard {
    grid-template-columns: 1fr;
  }
}
</style>
