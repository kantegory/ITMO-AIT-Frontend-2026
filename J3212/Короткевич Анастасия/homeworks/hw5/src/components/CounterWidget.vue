<script setup>
import { computed, ref } from 'vue'

const firstNumber = ref(0)
const secondNumber = ref(0)
const operation = ref('+')

const result = computed(() => {
  const a = Number(firstNumber.value)
  const b = Number(secondNumber.value)

  switch (operation.value) {
    case '-':
      return a - b
    case '*':
      return a * b
    case '/':
      return b === 0 ? 'Деление на 0 невозможно' : Number((a / b).toFixed(3))
    default:
      return a + b
  }
})
</script>

<template>
  <div class="calculator-card">
    <div class="calculator-grid">
      <label>
        Первое число
        <input v-model="firstNumber" type="number" />
      </label>

      <label>
        Второе число
        <input v-model="secondNumber" type="number" />
      </label>
    </div>

    <div class="operations" aria-label="Выбор операции">
      <button
        v-for="item in ['+', '-', '*', '/']"
        :key="item"
        type="button"
        :class="{ active: operation === item }"
        @click="operation = item"
      >
        {{ item }}
      </button>
    </div>

    <div class="result-box">
      <span>Результат</span>
      <strong>{{ result }}</strong>
    </div>
  </div>
</template>
