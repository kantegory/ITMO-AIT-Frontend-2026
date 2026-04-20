<script setup>
defineProps({
  tasks: {
    type: Array,
    required: true,
  },
})

defineEmits(['toggle-task', 'remove-task'])
</script>

<template>
  <section class="panel">
    <div class="header">
      <div>
        <h2>Список задач</h2>
        <p>Отмечайте выполненные пункты и удаляйте то, что уже неактуально.</p>
      </div>
      <span class="badge">Элементов: {{ tasks.length }}</span>
    </div>

    <ul v-if="tasks.length" class="task-list">
      <li v-for="task in tasks" :key="task.id" class="task-item">
        <label class="task-main">
          <input
            :checked="task.done"
            type="checkbox"
            @change="$emit('toggle-task', task.id)"
          />
          <span :class="{ done: task.done }">{{ task.text }}</span>
        </label>

        <button class="ghost-button" type="button" @click="$emit('remove-task', task.id)">
          Удалить
        </button>
      </li>
    </ul>

    <p v-else class="empty-state">Список пуст. Добавьте первую задачу через форму выше.</p>
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

.header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}

h2 {
  margin: 0 0 0.5rem;
  color: #0f172a;
}

p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
}

.badge {
  padding: 0.55rem 0.85rem;
  border-radius: 999px;
  background: #fff7ed;
  color: #c2410c;
  font-weight: 700;
}

.task-list {
  display: grid;
  gap: 0.85rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.task-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-radius: 16px;
  background: #f8fafc;
}

.task-main {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  color: #0f172a;
}

.task-main input {
  width: 1rem;
  height: 1rem;
}

.done {
  color: #94a3b8;
  text-decoration: line-through;
}

.ghost-button {
  padding: 0.75rem 1rem;
  border: 1px solid #fdba74;
  border-radius: 12px;
  background: transparent;
  color: #c2410c;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.empty-state {
  padding: 1rem;
  border-radius: 16px;
  background: #f8fafc;
}

@media (max-width: 700px) {
  .header,
  .task-item {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
