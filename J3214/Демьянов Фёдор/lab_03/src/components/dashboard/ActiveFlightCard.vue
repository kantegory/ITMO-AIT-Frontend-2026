<template>
  <div class="d-flex flex-column h-100">
    <!-- Если активных полетов нет -->
    <section
      v-if="!flight"
      class="bento-card p-4 p-md-5 text-center flex-grow-1 d-flex flex-column justify-content-center align-items-center"
      aria-label="Статус рейсов"
    >
      <i class="bi bi-compass text-muted-custom fs-1 mb-3" aria-hidden="true"></i>
      <h2 class="text-main mb-2 fs-4">Нет активных экспедиций</h2>
      <p class="text-muted-custom fs-7 mb-4">Вы пока не записаны ни в один полетный манифест.</p>
      <router-link to="/#catalog" class="btn btn-accent py-2 px-4 fs-7 letter-spacing-2 text-uppercase">
        Выбрать маршрут
      </router-link>
    </section>

    <!-- Карточка рейса -->
    <section
      v-else
      class="bento-card p-4 p-md-5 position-relative flex-grow-1 d-flex flex-column justify-content-between"
      aria-label="Ближайший рейс"
    >
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-uppercase letter-spacing-2 text-muted-custom fs-7 mb-0">
          Ближайший рейс // {{ flight.tourCode }}
        </h2>
        <span :class="[flight.statusBadge || 'badge-gold', 'px-2 py-1 fs-7 rounded']">
          {{ flight.status }}
        </span>
      </div>

      <div class="row align-items-center my-auto">
        <div class="col-12 col-md-8">
          <div class="d-flex align-items-center gap-2 gap-sm-4 mb-4">
            <div class="text-center">
              <div class="fs-6 fw-light text-muted-custom">{{ flight.originName || 'Земля (КК)' }}</div>
              <div class="display-6 fw-bold text-main">{{ flight.origin || 'EAR' }}</div>
            </div>
            <div class="flex-grow-1 d-flex align-items-center justify-content-center px-2 px-sm-3">
              <div class="flex-grow-1 border-top border-secondary border-opacity-50" aria-hidden="true"></div>
              <svg width="24" height="24" class="icon-md text-main mx-3" aria-hidden="true" focusable="false">
                <use href="#icon-rocket"></use>
              </svg>
              <div class="flex-grow-1 border-top border-secondary border-opacity-50" aria-hidden="true"></div>
            </div>
            <div class="text-center">
              <div class="fs-6 fw-light text-muted-custom">{{ flight.destinationName || flight.route }}</div>
              <div class="display-6 fw-bold text-main">{{ flight.destination || 'MARS' }}</div>
            </div>
          </div>

          <div class="d-flex justify-content-between mt-4 border-top border-secondary border-opacity-25 pt-4 flex-wrap gap-3">
            <div>
              <p class="text-muted-custom fs-7 mb-1 text-uppercase letter-spacing-2">Старт через</p>
              <p class="fs-4 fw-medium text-main mb-0">{{ flight.countdown || flight.date }}</p>
            </div>
            <div>
              <p class="text-muted-custom fs-7 mb-1 text-uppercase letter-spacing-2">Шлюз</p>
              <p class="fs-4 fw-medium text-main mb-0">{{ flight.gate || 'A-12' }}</p>
            </div>
            <div>
              <p class="text-muted-custom fs-7 mb-1 text-uppercase letter-spacing-2">Каюта</p>
              <p class="fs-4 fw-medium text-main mb-0">{{ flight.cabin || 'Модуль 1' }}</p>
            </div>
          </div>
        </div>

        <div class="col-md-4 d-none d-md-flex flex-column justify-content-center align-items-center border-start border-secondary border-opacity-25 ps-4 text-center">
          <i class="bi bi-qr-code text-main mb-2" style="font-size: 5rem; opacity: 0.75;" aria-hidden="true"></i>
          <button
            type="button"
            class="btn btn-glass fs-7 py-2 px-3 mt-2"
            @click="$emit('open-ticket')"
          >
            Билет и штрихкод
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
defineProps({
  flight: {
    type: Object,
    default: null
  }
})

defineEmits(['open-ticket'])
</script>