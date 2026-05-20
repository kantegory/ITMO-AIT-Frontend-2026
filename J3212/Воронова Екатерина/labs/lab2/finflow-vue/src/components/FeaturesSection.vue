<script setup lang="ts">
import FeatureCard from './FeatureCard.vue'

type Feature = {
  title: string
  text: string
  icon: string
}

const features: Feature[] = [
  {
    title: 'Учёт расходов',
    text: 'Добавляйте и отслеживайте все операции по категориям и счетам.',
    icon: '💳',
  },
  {
    title: 'Бюджеты',
    text: 'Устанавливайте лимиты по категориям и следите за остатком.',
    icon: '📊',
  },
  {
    title: 'Фильтрация',
    text: 'Ищите операции по сумме, дате, категории и описанию.',
    icon: '🔎',
  },
  {
    title: 'Интеграции',
    text: 'Подключайте платёжные аккаунты и импортируйте транзакции.',
    icon: '🔗',
  },
]
</script>

<template>
  <section class="features-section" id="features">
    <div class="container">
      <div class="section-heading">
        <h2>Возможности сервиса</h2>
        <p>Всё, что нужно для контроля бюджета и личных финансов</p>
      </div>

      <div class="features-grid">
        <FeatureCard
          v-for="item in features"
          :key="item.title"
          :title="item.title"
          :text="item.text"
          :icon="item.icon"
        />
      </div>
    </div>
  </section>
</template>