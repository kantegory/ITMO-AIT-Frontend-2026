<script setup>
import FeatureCard from '../components/FeatureCard.vue';

const features = [
  { icon: '🔐', title: 'Авторизация', description: 'Страницы входа и регистрации с валидацией форм и работой с API.' },
  { icon: '🎫', title: 'Личный кабинет', description: 'Просмотр купленных билетов, статусов заказов и оформление возврата.' },
  { icon: '🔎', title: 'Поиск и фильтры', description: 'Фильтрация мероприятий по типу, дате и месту проведения.' },
  { icon: '📊', title: 'Кабинет организатора', description: 'Создание событий и отображение аналитики продаж.' }
];

const categories = [
  { icon: '🎵', title: 'Концерты', description: 'Живые выступления популярных артистов и музыкальные фестивали.' },
  { icon: '🎭', title: 'Театр', description: 'Спектакли, премьеры и классические постановки в лучших залах.' },
  { icon: '🎤', title: 'Стендап', description: 'Юмористические шоу, вечерние программы и выступления комиков.' },
  { icon: '🏟️', title: 'Спорт', description: 'Матчи, турниры и крупные спортивные события в разных городах.' }
];
</script>

<template>
  <header class="hero-section py-5">
    <div class="container py-4">
      <div class="row align-items-center g-4">
        <section class="col-lg-6">
          <span class="badge bg-primary-subtle text-primary mb-3">Платформа покупки билетов</span>
          <h1 class="display-5 fw-bold mb-3">Находите мероприятия и покупайте билеты онлайн</h1>
          <p class="lead text-secondary mb-4">Концерты, театр, стендап, выставки и спорт в одном удобном сервисе.</p>
          <div class="d-flex flex-wrap gap-2">
            <router-link :to="{ name: 'search' }" class="btn btn-primary btn-lg">Найти мероприятие</router-link>
            <button class="btn btn-outline-dark btn-lg" data-bs-toggle="modal" data-bs-target="#aboutModal">Как это работает</button>
          </div>
        </section>

        <section class="col-lg-6">
          <article class="card shadow-lg border-0 rounded-4 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
              class="img-fluid hero-image"
              alt="Зрители на мероприятии"
            >
          </article>
        </section>
      </div>
    </div>
  </header>

  <main>
    <section class="py-5">
      <div class="container">
        <header class="text-center mb-5">
          <h2 class="fw-bold">Основные возможности</h2>
        </header>
        <div class="row g-4">
          <div v-for="feature in features" :key="feature.title" class="col-md-6 col-xl-3">
            <FeatureCard v-bind="feature" />
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-light">
      <div class="container">
        <header class="text-center mb-5">
          <h2 class="fw-bold">Популярные категории</h2>
          <p class="text-secondary mb-0">Выберите интересующее направление и найдите подходящее мероприятие.</p>
        </header>
        <div class="row g-4">
          <div v-for="category in categories" :key="category.title" class="col-md-6 col-xl-3">
            <FeatureCard v-bind="category" centered />
          </div>
        </div>
      </div>
    </section>
  </main>

  <div class="modal fade" id="aboutModal" tabindex="-1" aria-labelledby="aboutModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <section class="modal-content rounded-4">
        <header class="modal-header border-0">
          <h5 class="modal-title" id="aboutModalLabel">Как работает платформа</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </header>
        <div class="modal-body text-secondary">
          Пользователь выбирает мероприятие, фильтрует каталог, переходит на страницу события, бронирует билет и видит покупку в личном кабинете. Организатор создает свои события и следит за продажами.
        </div>
        <div class="modal-footer border-0">
          <router-link :to="{ name: 'search' }" class="btn btn-primary" data-bs-dismiss="modal">Перейти к поиску</router-link>
        </div>
      </section>
    </div>
  </div>
</template>
