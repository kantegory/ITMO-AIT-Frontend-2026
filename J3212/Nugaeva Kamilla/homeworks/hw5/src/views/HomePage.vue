<template>
  <BaseLayout>
    <AppNavbar />

    <section class="hero-block p-5 rounded-4 mb-5">
      <span class="text-primary text-uppercase fw-bold small">Планирование поездок</span>
      <h1 class="display-5 fw-bold mt-2 mb-3">Планируй путешествия просто и красиво</h1>
      <p class="lead text-muted mb-4">
        Ищи интересные направления, сравнивай варианты по бюджету и длительности,
        сохраняй маршруты и делись планами с друзьями.
      </p>

      <div class="d-flex gap-2 flex-wrap">
        <RouterLink class="btn btn-primary" to="/search">Начать поиск</RouterLink>
        <RouterLink class="btn btn-outline-primary" to="/profile">Кабинет</RouterLink>
      </div>
    </section>

    <section class="row g-4">
      <div class="col-md-4">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body">
            <h3 class="h5">Искать направления</h3>
            <p class="text-muted mb-0">
              Выбирать поездки по типу, бюджету и длительности.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body">
            <h3 class="h5">Сохранять маршруты</h3>
            <p class="text-muted mb-0">
              Добавлять понравившиеся варианты в личный кабинет.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body">
            <h3 class="h5">Делиться идеями</h3>
            <p class="text-muted mb-0">
              Оставлять заметки и делиться планами поездок.
            </p>
          </div>
        </div>
      </div>
    </section>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'
import AppNavbar from '../components/AppNavbar.vue'

export default {
  name: 'HomePage',
  components: { BaseLayout, AppNavbar },
}
</script>
