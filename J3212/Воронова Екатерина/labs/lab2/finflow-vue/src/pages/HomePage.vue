<script setup>
import { RouterLink } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import ThemeToggle from '../components/ThemeToggle.vue'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <div>
    <header class="site-header">
      <div class="container header-row">
        <div class="brand">FinFlow</div>

        <nav class="main-nav">
          <RouterLink to="/">Главная</RouterLink>
          <RouterLink to="/login">Вход</RouterLink>
          <RouterLink to="/register">Регистрация</RouterLink>
        </nav>

        <ThemeToggle :theme="theme" @toggle-theme="toggleTheme" />
      </div>
    </header>

    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-content">
          <span class="hero-badge">Финансовый сервис нового поколения</span>
          <h1>Управляйте личными финансами легко и удобно</h1>
          <p>
            Контролируйте расходы, отслеживайте счета, анализируйте бюджеты,
            фильтруйте транзакции и подключайте платёжные аккаунты в одном сервисе.
          </p>

          <div class="hero-actions">
            <RouterLink to="/dashboard" class="btn btn-main">Кабинет</RouterLink>
            <RouterLink to="/transactions" class="btn btn-accent">Транзакции</RouterLink>
          </div>
        </div>

        <div class="preview-card">
          <div class="preview-top">
            <span>FinFlow Dashboard</span>
            <span>↗</span>
          </div>

          <div class="preview-stats">
            <div class="mini-card">
              <p>Общий баланс</p>
              <h3>248 500 ₽</h3>
            </div>

            <div class="mini-card yellow">
              <p>Расходы за месяц</p>
              <h3>72 800 ₽</h3>
            </div>
          </div>

          <div class="preview-chart"></div>

          <div class="preview-list">
            <div><span>Продукты</span><strong>-4 200 ₽</strong></div>
            <div><span>Подписка</span><strong>-799 ₽</strong></div>
            <div><span>Зарплата</span><strong class="income">+85 000 ₽</strong></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>