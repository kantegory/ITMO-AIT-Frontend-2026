<template>
  <section class="page-intro mb-4">
    <div>
      <span class="page-kicker">Каталог направлений</span>

      <h1 class="page-title">
        Поиск путешествий
      </h1>

      <p class="page-subtitle mb-0">
        Подберите направление по типу, бюджету и длительности поездки.
      </p>
    </div>

    <div class="intro-badge-wrap">
      <div class="soft-counter-wrap">
        <span class="soft-counter" aria-live="polite">
          {{ filteredPlaces.length }}
        </span>

        <span class="soft-counter-label">
          вариантов найдено
        </span>
      </div>
    </div>
  </section>

  <div class="row g-4 align-items-start">
    <aside class="col-12 col-lg-4">
      <form
        class="panel filter-panel position-lg-sticky-top filter-sticky-card"
        @submit.prevent
      >
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h5 mb-0 d-flex align-items-center gap-2">
            <span>Фильтры</span>
          </h2>

          <button
            class="btn subtle-action-btn btn-sm"
            type="button"
            @click="resetFilters"
          >
            Сбросить
          </button>
        </div>

        <div class="mb-3">
          <label for="type" class="form-label">
            Тип
          </label>

          <select
            id="type"
            v-model="filters.type"
            class="form-select"
          >
            <option value="all">Любой</option>
            <option value="city">Город</option>
            <option value="nature">Природа</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="budget" class="form-label">
            Бюджет (до, $)
          </label>

          <input
            id="budget"
            v-model.number="filters.budget"
            type="number"
            class="form-control"
            placeholder="Например, 800"
            min="0"
          />
        </div>

        <div class="mb-4">
          <label for="days" class="form-label">
            Длительность
          </label>

          <select
            id="days"
            v-model="filters.days"
            class="form-select"
          >
            <option value="all">Любая</option>
            <option value="1-3">1–3 дня</option>
            <option value="4-7">4–7 дней</option>
            <option value="8+">8+ дней</option>
          </select>
        </div>

        <button
          class="btn btn-primary w-100"
          type="button"
        >
          Фильтры применяются автоматически
        </button>
      </form>
    </aside>

    <section class="col-12 col-lg-8">
      <div class="panel results-panel">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <div>
            <h2 class="section-heading mb-1 icon-label">
              <span>Подходящие варианты</span>
            </h2>

            <p class="section-caption mb-0">
              Готовые направления для демо-версии сервиса.
            </p>
          </div>
        </div>

        <div
          v-if="loading"
          class="text-muted"
        >
          Загружаем направления...
        </div>

        <div
          v-else-if="error"
          class="alert alert-danger"
          role="alert"
        >
          {{ error }}
        </div>

        <div
          v-else-if="filteredPlaces.length === 0"
          class="empty-state"
        >
          По выбранным фильтрам ничего не найдено. Попробуйте изменить бюджет,
          длительность или тип направления.
        </div>

        <div
          v-else
          class="results-grid"
          aria-live="polite"
        >
          <PlaceCard
            v-for="place in filteredPlaces"
            :key="place.id"
            :place="place"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import PlaceCard from '../components/PlaceCard.vue'
import { usePlaces } from '../composables/usePlaces'

const {
  loading,
  error,
  filters,
  filteredPlaces,
  loadPlaces,
  resetFilters,
} = usePlaces()

onMounted(() => {
  loadPlaces()
})
</script>