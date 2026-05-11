<template>
  <section class="hero mb-5">
    <div class="row g-4 align-items-center">
      <div class="col-12 col-lg-6">
        <span class="page-kicker">Планирование поездок</span>

        <h1 class="mb-3">
          Планируй путешествия просто и красиво
        </h1>

        <p class="lead mb-4">
          Ищи интересные направления, сравнивай варианты по бюджету и длительности,
          сохраняй маршруты и делись планами с друзьями в одном сервисе.
        </p>

        <div class="d-flex flex-wrap gap-2 mb-4">
          <RouterLink class="btn btn-primary btn-lg" to="/search">
            Начать поиск
          </RouterLink>

          <RouterLink class="btn btn-outline-primary btn-lg" to="/profile">
            Кабинет
          </RouterLink>
        </div>

        <div class="d-flex flex-wrap gap-2">
          <div class="hero-chip">5 готовых направлений</div>
          <div class="hero-chip">Фильтрация по бюджету</div>
          <div class="hero-chip">Сохранение маршрутов</div>
        </div>
      </div>

      <div class="col-12 col-lg-6">
        <img
          class="hero-img"
          src="/assets/img/hero.jpg"
          alt="Путешествия"
        />
      </div>
    </div>
  </section>

  <section class="section-soft mb-5">
    <div class="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
      <div>
        <span class="page-kicker">Главные возможности</span>

        <h2 class="section-title mb-2">
          Что можно сделать на сайте
        </h2>

        <p class="section-subtitle mb-0">
          В рамках лабораторной здесь показан базовый сценарий выбора и сохранения поездки.
        </p>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12 col-md-4">
        <div class="panel h-100">
          <span class="info-chip mb-3">01</span>

          <h3 class="h5 mb-2">
            Искать направления
          </h3>

          <p class="text-muted mb-0">
            Выбирать поездки по типу отдыха, бюджету и длительности.
          </p>
        </div>
      </div>

      <div class="col-12 col-md-4">
        <div class="panel h-100">
          <span class="info-chip mb-3">02</span>

          <h3 class="h5 mb-2">
            Сохранять маршруты
          </h3>

          <p class="text-muted mb-0">
            Добавлять понравившиеся варианты в личный кабинет.
          </p>
        </div>
      </div>

      <div class="col-12 col-md-4">
        <div class="panel h-100">
          <span class="info-chip mb-3">03</span>

          <h3 class="h5 mb-2">
            Делиться идеями
          </h3>

          <p class="text-muted mb-0">
            Оставлять короткие заметки и отправлять маршрут друзьям.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="section-soft">
    <div class="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
      <div>
        <span class="page-kicker">Популярные направления</span>

        <h2 class="section-title mb-2">
          Готовые идеи для поездки
        </h2>

        <p class="section-subtitle mb-0">
          Несколько демонстрационных маршрутов для коротких и более насыщенных путешествий.
        </p>
      </div>
    </div>

    <div v-if="loading" class="text-muted">
      Загружаем направления...
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else class="row g-4">
      <div
        v-for="place in popularPlaces"
        :key="place.id"
        class="col-12 col-md-4"
      >
        <PlaceCard :place="place" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import PlaceCard from '../components/PlaceCard.vue'
import { usePlaces } from '../composables/usePlaces'

const { places, loading, error, loadPlaces } = usePlaces()

const popularPlaces = computed(() => {
  const popularKeys = ['amsterdam', 'alps', 'karelia']

  return popularKeys
    .map((key) => places.value.find((place) => place.key === key))
    .filter(Boolean)
})

onMounted(() => {
  loadPlaces()
})
</script>