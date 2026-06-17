<script setup>
import { ref, computed } from 'vue';

const count = ref(0);
const step = ref(1);

const doubled = computed(() => count.value * 2);

function increment() {
  count.value += step.value;
}

function decrement() {
  count.value -= step.value;
}

function reset() {
  count.value = 0;
}
</script>

<template>
  <section class="card">
    <h2>Счётчик</h2>
    <p class="muted">Демонстрирует <code>ref</code>, <code>computed</code> и обработчики событий.</p>
    <div class="row">
      <button @click="decrement">−</button>
      <strong>{{ count }}</strong>
      <button @click="increment">+</button>
      <button class="secondary" @click="reset">Сбросить</button>
    </div>
    <p class="muted">Шаг: <input type="text" v-model.number="step" style="width: 60px" /> · удвоенное: {{ doubled }}</p>
  </section>
</template>
