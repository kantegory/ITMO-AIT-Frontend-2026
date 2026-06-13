<script setup>
import { ref, computed, onMounted } from 'vue'
import SpaceCard from '../components/SpaceCard.vue'
import { useSpaces } from '../composables/useSpaces.js'
import { useToast } from '../composables/useToast.js'

const { spaces, loading, error, fetchSpaces } = useSpaces()
const { showToast } = useToast()

const query  = ref('')
const status = ref('all')
const type   = ref('all')
const floor  = ref('all')
const areaMin = ref('')
const areaMax = ref('')

const application = ref({ visible: false, spaceName: '', person: '', phone: '', comment: '' })

const filtered = computed(() => {
  const q   = query.value.trim().toLowerCase()
  const min = Number(areaMin.value) || 0
  const max = Number(areaMax.value) || 9999
  return spaces.value.filter(s =>
    (!q       || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) &&
    (status.value === 'all' || s.status === status.value) &&
    (type.value   === 'all' || s.type   === type.value) &&
    (floor.value  === 'all' || String(s.floor) === floor.value) &&
    s.area >= min && s.area <= max
  )
})

const resetFilters = () => {
  query.value = ''; status.value = 'all'; type.value = 'all'
  floor.value = 'all'; areaMin.value = ''; areaMax.value = ''
}

const openApplication = (space) => {
  application.value = { visible: true, spaceName: space.name, person: '', phone: '', comment: '' }
}

const submitApplication = () => {
  application.value.visible = false
  showToast('Заявка на просмотр отправлена.')
}

onMounted(fetchSpaces)
</script>

<template>
  <main class="container py-4 py-lg-5">
    <section class="hero-card mb-4">
      <div class="row g-4 align-items-end">
        <div class="col-lg-8">
          <span class="eyebrow">Поиск</span>
          <h1>Свободные площади</h1>
          <p class="section-text">Каталог помещений — данные загружаются через axios из внешнего API.</p>
        </div>
        <div class="col-lg-4">
          <div class="stat-grid">
            <div class="stat-card"><strong>{{ filtered.length }}</strong><span>помещений в выдаче</span></div>
            <div class="stat-card"><strong>3 статуса</strong><span>свободно, резерв, сдано</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="row g-4 align-items-start">
      <div class="col-xl-3">
        <aside class="filter-panel">
          <span class="eyebrow" style="color: var(--eyebrow-accent)">Фильтры</span>
          <h2 class="section-title">Подобрать помещение</h2>
          <div class="row g-3 mt-1">
            <div class="col-12">
              <label class="form-label" for="spaceQuery">Поиск</label>
              <input v-model="query" class="form-control" id="spaceQuery" type="search" placeholder="Например, лофт 3.12" />
            </div>
            <div class="col-12">
              <label class="form-label" for="spaceStatus">Статус</label>
              <select v-model="status" class="form-select" id="spaceStatus">
                <option value="all">Все</option>
                <option value="free">Свободно</option>
                <option value="reserved">В резерве</option>
                <option value="rented">Сдано</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label" for="spaceType">Тип</label>
              <select v-model="type" class="form-select" id="spaceType">
                <option value="all">Все</option>
                <option value="office">Офис</option>
                <option value="loft">Лофт</option>
                <option value="showroom">Шоурум</option>
                <option value="storage">Склад</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label" for="spaceFloor">Этаж</label>
              <select v-model="floor" class="form-select" id="spaceFloor">
                <option value="all">Любой</option>
                <option value="1">1 этаж</option>
                <option value="2">2 этаж</option>
                <option value="3">3 этаж</option>
                <option value="4">4 этаж</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label" for="areaMin">Площадь от</label>
              <input v-model="areaMin" class="form-control" id="areaMin" type="number" placeholder="50" />
            </div>
            <div class="col-6">
              <label class="form-label" for="areaMax">Площадь до</label>
              <input v-model="areaMax" class="form-control" id="areaMax" type="number" placeholder="300" />
            </div>
            <div class="col-12 pt-2">
              <button class="btn btn-outline-brand w-100" type="button" @click="resetFilters">Сбросить фильтры</button>
            </div>
          </div>
        </aside>
      </div>

      <div class="col-xl-9">
        <p class="result-note mb-3">Данные помещений загружены через axios из dummyjson.com.</p>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" style="color: var(--wine-600)" role="status">
            <span class="visually-hidden">Загрузка…</span>
          </div>
        </div>

        <div v-else-if="error" class="page-card text-center py-4">
          <p class="section-text mb-3">{{ error }}</p>
          <button class="btn btn-outline-brand" @click="fetchSpaces">Повторить</button>
        </div>

        <template v-else>
          <div class="row g-4">
            <div v-for="space in filtered" :key="space.id" class="col-md-6">
              <SpaceCard :space="space" @apply="openApplication" />
            </div>
          </div>
          <div v-if="filtered.length === 0" class="empty-state mt-4 is-visible">
            По текущим фильтрам ничего не найдено.
          </div>
        </template>
      </div>
    </section>
  </main>

  <template v-if="application.visible">
    <div class="modal-backdrop fade show"></div>
    <div class="modal d-block" tabindex="-1" @click.self="application.visible = false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title fs-4">Заявка на просмотр</h2>
            <button class="btn-close" type="button" @click="application.visible = false" aria-label="Закрыть"></button>
          </div>
          <form @submit.prevent="submitApplication">
            <div class="modal-body">
              <p class="mb-3">Помещение: <strong>{{ application.spaceName }}</strong></p>
              <div class="mb-3">
                <label class="form-label" for="appPerson">Контактное лицо</label>
                <input v-model="application.person" class="form-control" id="appPerson" type="text" placeholder="Анна Петрова" required />
              </div>
              <div class="mb-3">
                <label class="form-label" for="appPhone">Телефон</label>
                <input v-model="application.phone" class="form-control" id="appPhone" type="tel" placeholder="+7 (999) 000-00-00" required />
              </div>
              <div>
                <label class="form-label" for="appComment">Комментарий</label>
                <textarea v-model="application.comment" class="form-control" id="appComment" rows="3" placeholder="Удобно после 15:00"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-brand" type="button" @click="application.visible = false">Отмена</button>
              <button class="btn btn-brand" type="submit">Отправить</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
</template>

