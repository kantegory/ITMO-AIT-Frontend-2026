<template>
  <section class="mb-4">
    <img
      class="destination-hero"
      :src="place.hero"
      :alt="place.title"
    />
  </section>

  <section class="page-intro mb-4">
    <div>
      <span class="page-kicker">Карточка направления</span>

      <h1 class="page-title">
        {{ place.title }}
      </h1>

      <p class="page-subtitle mb-0">
        {{ place.typeLabel }} · {{ place.days }} дней · до {{ place.budget }} $
      </p>
    </div>

    <div class="intro-badge-wrap">
      <span class="place-badge">
        {{ place.badge }}
      </span>
    </div>
  </section>

  <div class="row g-4">
    <div class="col-12 col-lg-8">
      <section class="panel mb-4">
        <div class="row g-3">
          <div
            v-for="image in place.gallery"
            :key="image"
            class="col-4"
          >
            <img
              class="gallery-img"
              :src="image"
              :alt="place.title"
            />
          </div>
        </div>
      </section>

      <section class="panel mb-4">
        <h2 class="section-heading mb-2">О направлении</h2>
        <p class="mb-0 text-muted">
          {{ place.description }}
        </p>
      </section>

      <section class="panel">
        <h2 class="section-heading mb-3">Что посмотреть</h2>

        <ul>
          <li v-for="item in place.placesList" :key="item">
            {{ item }}
          </li>
        </ul>

        <h2 class="section-heading mt-4 mb-3">Советы</h2>

        <ul>
          <li v-for="item in place.tipsList" :key="item">
            {{ item }}
          </li>
        </ul>

        <h2 class="section-heading mt-4 mb-3">Что включено</h2>

        <ul class="mb-0">
          <li v-for="item in place.includedList" :key="item">
            {{ item }}
          </li>
        </ul>
      </section>
    </div>

    <div class="col-12 col-lg-4">
      <section class="panel mb-4">
        <h2 class="section-heading mb-2">
          Карта
        </h2>

        <p class="section-caption">
          Небольшой обзор района и расположения направления.
        </p>

        <div class="ratio ratio-4x3 rounded-4 overflow-hidden">
          <iframe
            :src="place.map"
            style="border: 0;"
            loading="lazy"
            title="Карта направления"
          ></iframe>
        </div>
      </section>

      <section class="panel">
        <h2 class="section-heading mb-2">
          Сохранить маршрут
        </h2>

        <p class="section-caption">
          Добавьте направление в кабинет, чтобы вернуться к нему позже.
        </p>

        <button class="btn btn-primary w-100 mb-3" type="button">
          Сохранить маршрут
        </button>

        <p class="text-muted small mb-0">
          После сохранения маршрут появится на странице «Кабинет».
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const places = {
  amsterdam: {
    title: 'Амстердам',
    typeLabel: 'Город',
    budget: 700,
    days: 5,
    badge: 'Популярно',
    hero: '/assets/img/amsterdam-hero.jpg',
    gallery: [
      '/assets/img/amsterdam-1.jpg',
      '/assets/img/amsterdam-2.jpg',
      '/assets/img/amsterdam-3.jpg',
    ],
    description: 'Каналы, музеи, прогулки и уютные районы.',
    placesList: ['Прогулка по каналам', 'Рейксмузеум', 'Музей Ван Гога', 'Район Jordaan'],
    tipsList: [
      'Покупайте билеты в музеи заранее',
      'Для коротких маршрутов удобно передвигаться пешком и на велосипеде',
      'Жильё за пределами центра часто дешевле',
    ],
    includedList: ['Маршрут на 5 дней', 'Подборка достопримечательностей', 'Советы по бюджету', 'Карта района'],
    map: 'https://www.openstreetmap.org/export/embed.html?bbox=4.88%2C52.35%2C4.92%2C52.38&layer=mapnik',
  },
  alps: {
    title: 'Альпы',
    typeLabel: 'Природа',
    budget: 1200,
    days: 7,
    badge: 'Активный отдых',
    hero: '/assets/img/alps-hero.jpg',
    gallery: ['/assets/img/alps-1.jpg', '/assets/img/alps-2.jpg', '/assets/img/alps-3.jpg'],
    description: 'Горы, ледники, панорамные виды и активный отдых.',
    placesList: ['Панорамные смотровые площадки', 'Горные маршруты', 'Озёра и долины', 'Канатные дороги'],
    tipsList: ['Проверяйте погоду перед походами', 'Берите удобную обувь и одежду слоями', 'Часть маршрутов лучше бронировать заранее'],
    includedList: ['Маршрут на 7 дней', 'Природные точки', 'Советы по экипировке', 'Карта местности'],
    map: 'https://www.openstreetmap.org/export/embed.html?bbox=10.8%2C46.5%2C11.4%2C47.0&layer=mapnik',
  },
  karelia: {
    title: 'Карелия',
    typeLabel: 'Природа',
    budget: 300,
    days: 3,
    badge: 'Бюджетно',
    hero: '/assets/img/karelia-hero.jpg',
    gallery: ['/assets/img/karelia-1.jpg', '/assets/img/karelia-2.jpg', '/assets/img/karelia-3.jpg'],
    description: 'Озёра, леса, тишина и короткая перезагрузка на природе.',
    placesList: ['Озёра и лесные тропы', 'Смотровые площадки', 'Небольшие природные маршруты', 'Тихие базы отдыха'],
    tipsList: ['Лучше заранее продумать транспорт', 'Возьмите тёплую одежду даже летом', 'Уточняйте связь и интернет в месте проживания'],
    includedList: ['Маршрут на 3 дня', 'Природные точки', 'Рекомендации по вещам', 'Карта района'],
    map: 'https://www.openstreetmap.org/export/embed.html?bbox=33.0%2C61.5%2C35.0%2C62.5&layer=mapnik',
  },
}

const place = computed(() => {
  return places[route.params.placeKey] || places.amsterdam
})
</script>
