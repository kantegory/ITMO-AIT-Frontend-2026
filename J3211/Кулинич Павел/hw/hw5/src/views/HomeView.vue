<template>
  <main>
    <HeroSection />

    <section class="section">
      <div class="container">
        <h2 class="section-title">Основные возможности</h2>

        <div class="grid grid-4">
          <FeatureCard
            title="Авторизация"
            text="Страницы входа и регистрации с базовой валидацией форм."
            icon="👤"
          />
          <FeatureCard
            title="Личный кабинет"
            text="Просмотр купленных билетов и статусов заказов."
            icon="🎫"
          />
          <FeatureCard
            title="Поиск и фильтры"
            text="Поиск мероприятий по типу, дате и месту."
            icon="🔎"
          />
          <FeatureCard
            title="Кабинет организатора"
            text="Создание событий и просмотр статистики."
            icon="📊"
          />
        </div>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        <h2 class="section-title">Популярные категории</h2>
        <p class="section-subtitle">
          Выберите интересующее направление и найдите подходящее мероприятие.
        </p>

        <div class="grid grid-4">
          <CategoryCard title="Концерты" text="Живые выступления популярных артистов." icon="🎵" />
          <CategoryCard title="Театр" text="Спектакли, премьеры и классические постановки." icon="🎭" />
          <CategoryCard title="Стендап" text="Юмористические шоу и выступления комиков." icon="🎤" />
          <CategoryCard title="Спорт" text="Матчи, турниры и крупные события." icon="🏟️" />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import HeroSection from '../components/HeroSection.vue'
import FeatureCard from '../components/FeatureCard.vue'
import CategoryCard from '../components/CategoryCard.vue'
</script>