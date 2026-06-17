<template>
  <section class="page container py-4">
    <p
      v-if="apiMessage"
      id="apiStatus"
      class="alert mb-3 small"
      :class="apiError ? 'alert-danger' : 'alert-info'"
      role="status"
      aria-live="assertive"
    >
      {{ apiMessage }}
    </p>

    <header class="mb-4">
      <h1 id="searchPageHeading" class="h4 mb-2 d-inline-flex align-items-center gap-2 flex-wrap">
        <svg class="sprite-icon text-secondary" width="22" height="22" aria-hidden="true" focusable="false">
          <use href="#icon-search" />
        </svg>
        <span>Поиск мероприятий</span>
      </h1>
      <p class="text-secondary mb-0">
        Найдите концерты, фестивали и лекции. Фильтруйте по типу, дате и месту.
      </p>
    </header>

    <SearchFilters @search="onSearch" />

    <section aria-label="Список мероприятий">
      <p v-if="loading" class="text-secondary" role="status">Загрузка…</p>
      <div
        v-else
        class="row g-3"
        aria-live="polite"
        aria-relevant="additions text"
      >
        <template v-if="displayed.length">
          <EventCard v-for="ev in displayed" :key="ev.id" :event="ev" />
        </template>
        <p v-else class="text-secondary" role="status">
          Подходящих мероприятий нет. Измените условия поиска.
        </p>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

import EventCard from '@/components/EventCard.vue'
import SearchFilters from '@/components/SearchFilters.vue'
import { useEventsApi } from '@/composables/useEventsApi'
import { applyEventFilters } from '@/utils/events'

const { fetchEventsList } = useEventsApi()

const allEvents = ref([])
const filters = reactive({
  query: '',
  type: '',
  date: '',
  city: '',
})

const loading = ref(true)
const apiMessage = ref('')
const apiError = ref(false)

const displayed = computed(() => applyEventFilters(allEvents.value, filters))

function onSearch(payload) {
  filters.query = payload.query ?? ''
  filters.type = payload.type ?? ''
  filters.date = payload.date ?? ''
  filters.city = payload.city ?? ''
}

onMounted(async () => {
  loading.value = true
  apiMessage.value = ''
  try {
    allEvents.value = await fetchEventsList()
  } catch {
    apiError.value = true
    apiMessage.value =
      'Не удаётся связаться с сервером данных. В папке lab2 выполните npm run api и обновите страницу.'
  } finally {
    loading.value = false
  }
})
</script>
