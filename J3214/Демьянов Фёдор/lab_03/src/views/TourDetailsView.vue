<template>
  <div>
    <TheNavbar />

    <main id="main-content" class="py-5" v-if="tour">
      <div class="container-fluid custom-container px-4 px-md-5">
        <!-- Навигация возврата -->
        <div class="mb-4">
          <router-link
            to="/#catalog"
            class="nav-link px-0 d-inline-flex align-items-center gap-2 letter-spacing-2 text-uppercase mb-4 fs-7"
          >
            <svg class="icon icon-sm" aria-hidden="true" focusable="false">
              <use href="#icon-arrow-left"></use>
            </svg>
            Вернуться к реестру миссий
          </router-link>
        </div>

        <!-- Заголовок и тариф -->
        <div class="row align-items-end mb-5 g-4">
          <div class="col-lg-8">
            <div class="d-flex gap-2 align-items-center mb-3">
              <span :class="[tour.badgeClass, 'px-2 py-1 fs-7 rounded']">{{ tour.badge }}</span>
              <span class="text-muted-custom fs-7" aria-label="Шифр миссии">{{ tour.code }}</span>
            </div>
            <h1 class="display-4 fw-bold text-main mb-3">{{ tour.title }}</h1>
            <p class="hero-subtitle mb-0" style="max-width: 700px;">{{ tour.desc }}</p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <div class="fs-7 text-muted-custom mb-1 text-uppercase letter-spacing-2">Базовый тариф</div>
            <div class="display-6 fw-bold text-main mb-3">{{ tour.price?.toLocaleString('ru-RU') }} $</div>
            <button
              type="button"
              class="btn btn-accent py-3 px-4 w-100 letter-spacing-2 fs-7"
              @click="isModalOpen = true"
            >
              Забронировать место
            </button>
          </div>
        </div>

        <div class="row g-5">
          <!-- Левая колонка: галерея, параметры, таймлайн -->
          <div class="col-lg-8">
            <TourGallery :slides="tour.slides" />
            <TourSpecs :specs="tour.specs" />
            <TourTimeline :timeline="tour.timeline" />
          </div>

          <!-- Правая колонка: статус экипажа и включенные опции -->
          <div class="col-lg-4">
            <div class="sticky-top" style="top: 100px; z-index: 10;">
              <section class="glass-panel p-4 p-md-5 mb-4" aria-labelledby="statusHeading">
                <h2 id="statusHeading" class="text-uppercase letter-spacing-2 fs-7 text-muted-custom mb-4">
                  Статус набора экипажа
                </h2>
                <div class="d-flex justify-content-between mb-3 border-bottom border-secondary border-opacity-25 pb-2">
                  <span class="text-muted-custom fs-7">Ближайшее окно:</span>
                  <span class="text-main fs-7 fw-medium">{{ tour.window }}</span>
                </div>
                <div class="d-flex justify-content-between mb-3 border-bottom border-secondary border-opacity-25 pb-2">
                  <span class="text-muted-custom fs-7">Свободно мест:</span>
                  <span class="badge-silver px-2 py-1 fs-7 rounded">{{ tour.seats }}</span>
                </div>
                <div class="d-flex justify-content-between mb-4 border-bottom border-secondary border-opacity-25 pb-2">
                  <span class="text-muted-custom fs-7">Корабль:</span>
                  <span class="text-main fs-7 fw-medium">{{ tour.ship }}</span>
                </div>

                <button
                  type="button"
                  class="btn btn-accent w-100 py-3 letter-spacing-2 fs-7 mb-3"
                  @click="isModalOpen = true"
                >
                  Подать заявку
                </button>
                <p class="text-center text-muted-custom fs-7 mb-0">Требуется медицинский допуск NovaTransit</p>
              </section>

              <section class="glass-panel p-4" aria-labelledby="includedHeading">
                <h2 id="includedHeading" class="text-main fs-7 text-uppercase letter-spacing-2 mb-3">
                  В стоимость включено
                </h2>
                <ul class="list-unstyled mb-0 fs-7 text-muted-custom">
                  <li class="mb-2 d-flex align-items-center gap-2">
                    <svg class="icon text-main" aria-hidden="true" focusable="false">
                      <use href="#icon-check"></use>
                    </svg>
                    <span>Комплексный предполетный тренинг</span>
                  </li>
                  <li class="mb-2 d-flex align-items-center gap-2">
                    <svg class="icon text-main" aria-hidden="true" focusable="false">
                      <use href="#icon-check"></use>
                    </svg>
                    <span>Персональный кастомизированный скафандр</span>
                  </li>
                  <li class="mb-2 d-flex align-items-center gap-2">
                    <svg class="icon text-main" aria-hidden="true" focusable="false">
                      <use href="#icon-check"></use>
                    </svg>
                    <span>Размещение в каюте с индивидуальным иллюминатором</span>
                  </li>
                  <li class="d-flex align-items-center gap-2">
                    <svg class="icon text-main" aria-hidden="true" focusable="false">
                      <use href="#icon-check"></use>
                    </svg>
                    <span>Страховой полис аэрокосмического риска</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>

          <!-- Отзывы кадетов -->
          <div class="col-12">
            <section class="glass-panel p-4 p-md-5" aria-labelledby="reviewsHeading">
              <h2 id="reviewsHeading" class="text-uppercase letter-spacing-2 fs-6 text-main mb-4">
                Отчеты участников предыдущих миссий
              </h2>
              <div class="row g-4">
                <div class="col-md-6">
                  <article class="border border-secondary border-opacity-25 rounded p-3 h-100">
                    <div class="d-flex align-items-center gap-2 mb-3">
                      <img
                        src="https://ui-avatars.com/api/?name=Alex+V&background=223b59&color=fff&size=40"
                        class="rounded-circle"
                        alt="Алексей Васильев"
                        width="40"
                        height="40"
                      >
                      <div>
                        <div class="fs-7 fw-medium text-main">Алексей Васильев</div>
                        <div class="fs-7 text-muted-custom">Экспедиция EXP-01, ноябрь 2025</div>
                      </div>
                    </div>
                    <p class="fs-7 text-muted-custom mb-0">
                      "Ощущение полной тишины и вид ночных огней континентов из обзорного купола — опыт, меняющий восприятие. Перегрузки при старте ощутимые, но центрифуга подготовила организм на 100%"
                    </p>
                  </article>
                </div>
                <div class="col-md-6">
                  <article class="border border-secondary border-opacity-25 rounded p-3 h-100">
                    <div class="d-flex align-items-center gap-2 mb-3">
                      <img
                        src="https://ui-avatars.com/api/?name=Elena+R&background=1a1e29&color=dfb15b&size=40"
                        class="rounded-circle"
                        alt="Елена Ростова"
                        width="40"
                        height="40"
                      >
                      <div>
                        <div class="fs-7 fw-medium text-main">Елена Ростова</div>
                        <div class="fs-7 text-muted-custom">Лунная программа, январь 2026</div>
                      </div>
                    </div>
                    <p class="fs-7 text-muted-custom mb-0">
                      "Жилой модуль спроектирован великолепно: индивидуальная каюта, прекрасная звукоизоляция и автономная вентиляция. Опция шлюзования стоила каждого доллара"
                    </p>
                  </article>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- Модалка бронирования -->
        <BookingModal
          :is-open="isModalOpen"
          :tour="tour"
          @close="isModalOpen = false"
        />
      </div>
    </main>

    <!-- Загрузка -->
    <div v-else class="text-center py-5">
      <div class="spinner-border text-light mb-3" role="status"></div>
      <p class="text-muted-custom fs-7 letter-spacing-2 text-uppercase">Загрузка данных миссии...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import TheNavbar from '../components/common/TheNavbar.vue'
import TourGallery from '../components/tour/TourGallery.vue'
import TourSpecs from '../components/tour/TourSpecs.vue'
import TourTimeline from '../components/tour/TourTimeline.vue'
import BookingModal from '../components/tour/BookingModal.vue'
import { toursApi } from '../api/tours'

const route = useRoute()
const tour = ref(null)
const isModalOpen = ref(false)

const loadTour = async (id) => {
  try {
    tour.value = await toursApi.getById(id)
  } catch (err) {
    console.warn(`Экспедиция ${id} не найдена. Загрузка Луны по умолчанию.`)
    try {
      tour.value = await toursApi.getById('moon')
    } catch (e) {
      alert('Ошибка связи с сервером базы данных.')
    }
  }
}

onMounted(() => loadTour(route.params.id))
watch(() => route.params.id, (newId) => {
  if (newId) loadTour(newId)
})
</script>