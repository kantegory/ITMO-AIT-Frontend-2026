<script setup>
import { ref } from 'vue'
import UserGreeting from './components/UserGreeting.vue'
import CounterWidget from './components/CounterWidget.vue'
import TaskList from './components/TaskList.vue'

const userName = ref('Анастасия')
const role = ref('Студент')
</script>

<template>
  <div class="app-shell">
    <header class="hero">
      <nav class="navbar">
        <div class="logo">VueHub</div>
      </nav>

      <section id="home" class="hero-content">
        <div class="hero-text">
          <h1>Добро пожаловать в приложение!</h1>
          <div class="hero-actions">
            <a class="primary-btn" href="#calculator">Открыть калькулятор</a>
            <a class="secondary-btn" href="#tasks">Посмотреть задачи</a>
          </div>
        </div>

        <div class="hero-card">
          <UserGreeting :name="userName" v-model:role="role" />
        </div>
      </section>
    </header>

    <main class="content">
      <section id="calculator" class="section-block">
        <div class="section-heading">
          <h2>Калькулятор</h2>
        </div>
        <CounterWidget />
      </section>

      <section id="tasks" class="section-block">
        <div class="section-heading">
          <h2>Список задач</h2>
        </div>
        <TaskList />
      </section>
    </main>
  </div>
</template>
