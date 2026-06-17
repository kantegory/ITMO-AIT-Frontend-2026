<template>
  <section class="page container py-4">
    <h1 class="h4 mb-4 d-inline-flex align-items-center gap-2 flex-wrap">
      <svg class="sprite-icon text-secondary" width="22" height="22" aria-hidden="true" focusable="false">
        <use href="#icon-building" />
      </svg>
      <span>Кабинет организатора</span>
    </h1>

    <div class="row g-4">
      <div class="col-12 col-lg-5">
        <section class="card h-100" aria-labelledby="createEventHeading">
          <div class="card-body">
            <h2 id="createEventHeading" class="h6 mb-3">Создать событие</h2>
            <form aria-label="Форма создания события" @submit.prevent="create">
              <div class="mb-2">
                <label for="eventTitle" class="form-label">Название</label>
                <input id="eventTitle" v-model="form.title" type="text" class="form-control" autocomplete="off" required />
              </div>
              <div class="mb-2">
                <label for="eventCity" class="form-label">Город</label>
                <select id="eventCity" v-model="form.city" class="form-select" required>
                  <option value="">Выберите город</option>
                  <option value="spb">Санкт‑Петербург</option>
                  <option value="msk">Москва</option>
                  <option value="nsk">Новосибирск</option>
                  <option value="ptz">Петрозаводск</option>
                </select>
              </div>
              <div class="mb-2">
                <label for="eventDate" class="form-label">Дата</label>
                <input
                  id="eventDate"
                  v-model="form.date"
                  type="text"
                  class="form-control"
                  required
                  inputmode="text"
                  autocomplete="off"
                  placeholder="ГГГГ-ММ-ДД"
                  pattern="\d{4}-\d{2}-\d{2}"
                  maxlength="10"
                  aria-describedby="eventDateHint"
                  title="Формат: ГГГГ-ММ-ДД"
                />
                <p id="eventDateHint" class="form-text small mb-0">
                  Формат: <strong>ГГГГ-ММ-ДД</strong> (например, 2026-03-29).
                </p>
              </div>
              <div class="mb-2">
                <label for="eventType" class="form-label">Тип</label>
                <select id="eventType" v-model="form.type" class="form-select" required>
                  <option value="concert">Концерт</option>
                  <option value="theatre">Театр</option>
                  <option value="festival">Фестиваль</option>
                </select>
              </div>
              <div class="mb-2">
                <label for="eventPrice" class="form-label">Цена от</label>
                <input
                  id="eventPrice"
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  class="form-control"
                  inputmode="numeric"
                  autocomplete="off"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100 mt-2" :disabled="busy">Добавить событие</button>
            </form>
          </div>
        </section>
      </div>
      <div class="col-12 col-lg-7">
        <section class="card h-100" aria-labelledby="organizerEventsHeading">
          <div class="card-body">
            <h2 id="organizerEventsHeading" class="h6 mb-3">Мои события</h2>
            <div class="row g-3" role="region" aria-live="polite" :aria-labelledby="'organizerEventsHeading'" :aria-busy="loading ? 'true' : undefined">
              <template v-if="myEvents.length">
                <div v-for="ev in myEvents" :key="ev.id" class="col-12">
                  <article class="card h-100">
                    <div class="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <h3 class="h6 mb-1">{{ ev.title }}</h3>
                        <p class="small text-secondary mb-0">{{ cityLabel(ev.city) }} · {{ ev.date }}</p>
                      </div>
                      <span class="fw-semibold">{{ ev.priceFrom }} ₽</span>
                    </div>
                  </article>
                </div>
              </template>
            </div>
            <p v-if="helperText" class="text-secondary small mb-0">{{ helperText }}</p>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

import { http, unwrap } from '@/api/http'
import { useAuth } from '@/composables/useAuth'
import { useCity } from '@/composables/useCity'
import { useEventsApi } from '@/composables/useEventsApi'
import { useToast } from '@/composables/useToast'

const { currentUser } = useAuth()
const { cityLabel } = useCity()
const { fetchEventsList } = useEventsApi()
const { show } = useToast()

const allEvents = ref([])
const loading = ref(true)
const busy = ref(false)

const form = reactive({
  title: '',
  city: '',
  date: '',
  type: 'concert',
  price: 0,
})

const myEvents = computed(() => {
  const uid = currentUser.value?.id
  if (uid == null) return []
  return allEvents.value.filter((e) => Number(e.organizerUserId) === Number(uid))
})

const helperText = computed(() => {
  if (loading.value) return ''
  if (!myEvents.value.length) return 'Событий пока нет. Создайте первое ниже.'
  return ''
})

async function refresh() {
  loading.value = true
  try {
    allEvents.value = await fetchEventsList()
  } catch {
    show('Не удалось загрузить список ваших событий')
  } finally {
    loading.value = false
  }
}

async function create() {
  const user = currentUser.value
  if (!user?.id) {
    show('Войдите в аккаунт, чтобы создавать события')
    return
  }
  busy.value = true
  try {
    const body = {
      title: form.title.trim(),
      type: form.type,
      city: form.city,
      cityName: cityLabel(form.city),
      date: form.date.trim(),
      venue: 'Площадка будет уточнена',
      priceFrom: Number(form.price),
      description: 'Событие, добавленное организатором.',
      reviews: [],
      organizerUserId: user.id,
    }
    const res = await http.post('/events', body)
    await unwrap(res, 'Не удалось создать событие')
    show('Событие создано')
    form.title = ''
    form.city = ''
    form.date = ''
    form.type = 'concert'
    form.price = 0
    await refresh()
  } catch {
    show('Не удалось создать событие')
  } finally {
    busy.value = false
  }
}

onMounted(refresh)
</script>
