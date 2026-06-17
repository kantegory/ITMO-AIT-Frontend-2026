<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import ItemCard from '../components/ItemCard.vue'
import { useItems } from '../composables/useItems'

const { models, datasets, loadItems } = useItems()

onMounted(loadItems)
</script>

<template>
  <main class="home-page">

    <section class="hero">
      <div class="hero-content">
        <h1>
          Платформа для публикации
          AI-моделей и датасетов
        </h1>

        <p class="hero-text">
          ModelHub помогает искать модели, открывать карточки объектов,
          смотреть профиль автора и работать с данными из mock API.
        </p>
      </div>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2><svg class="section-icon" aria-hidden="true"><use href="/sprite.svg#icon-trending" /></svg>Популярные модели</h2>
        <RouterLink to="/search?type=model">Все модели</RouterLink>
      </div>

      <div class="cards-grid">
        <ItemCard
            v-for="item in models"
            :key="item.id"
            :item="item"
        />
      </div>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2><svg class="section-icon" aria-hidden="true"><use href="/sprite.svg#icon-dataset" /></svg>Датасеты</h2>
        <RouterLink to="/search?type=dataset">Все датасеты</RouterLink>
      </div>

      <div class="cards-grid">
        <ItemCard
            v-for="item in datasets"
            :key="item.id"
            :item="item"
        />
      </div>
    </section>

  </main>
</template>
