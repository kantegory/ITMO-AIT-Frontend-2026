<script setup lang="ts">
import FinancePreview from './FinancePreview.vue'
</script>

<template>
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
          <button class="btn btn-main">Начать</button>
          <button class="btn btn-accent">Войти</button>
        </div>
      </div>

      <FinancePreview />
    </div>
  </section>
</template>