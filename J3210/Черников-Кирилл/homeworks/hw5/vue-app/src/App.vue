<template>
  <div class="app">
    <header class="app-header">
      <h1>DataForge — изучение Vue.js</h1>
      <p>Домашняя работа 5: менеджер зависимостей NPM и основы Vue.js</p>
    </header>

    <p class="section-title">Компоненты приложения</p>

    <div class="grid">
      <UserGreeting :name="userName" v-model:role="userRole" />
      <CounterWidget />
    </div>

    <TaskList />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserGreeting from './components/UserGreeting.vue'
import CounterWidget from './components/CounterWidget.vue'
import TaskList from './components/TaskList.vue'

const userName = ref('Кирилл')
const userRole = ref('Исполнитель')
</script>
