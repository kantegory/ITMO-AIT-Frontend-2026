<script setup>
import { ref, computed } from 'vue';
import TodoItem from './TodoItem.vue';

const items = ref([
  { id: 1, text: 'Изучить npm-команды', done: true },
  { id: 2, text: 'Поднять Vite-проект на Vue', done: true },
  { id: 3, text: 'Разобраться с компонентами и пропсами', done: false },
]);

const draft = ref('');
let nextId = 4;

const remaining = computed(() => items.value.filter((item) => !item.done).length);

function add() {
  const text = draft.value.trim();
  if (!text) return;
  items.value.push({ id: nextId++, text, done: false });
  draft.value = '';
}

function toggle(id) {
  const item = items.value.find((i) => i.id === id);
  if (item) item.done = !item.done;
}

function remove(id) {
  items.value = items.value.filter((i) => i.id !== id);
}
</script>

<template>
  <section class="card">
    <h2>Список дел</h2>
    <p class="muted">Демонстрирует <code>v-model</code>, <code>v-for</code>, props и события компонентов.</p>
    <form class="row" @submit.prevent="add">
      <input type="text" v-model="draft" placeholder="Что нужно сделать?" />
      <button type="submit">Добавить</button>
    </form>
    <ul>
      <TodoItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @toggle="toggle"
        @remove="remove"
      />
      <li v-if="!items.length">
        <span class="muted">Список пуст.</span>
      </li>
    </ul>
    <p class="muted">Осталось: {{ remaining }}</p>
  </section>
</template>
