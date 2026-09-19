<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen && flight"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-labelledby="ticketModalLabel"
      aria-modal="true"
      style="background-color: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px);"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content glass-panel border border-secondary" style="background-color: var(--bg-surface);">
          <div class="modal-header border-bottom border-secondary border-opacity-25">
            <h2 class="modal-title fs-6 text-uppercase letter-spacing-2 text-main" id="ticketModalLabel">
              Посадочный сертификат // {{ flight.tourCode }}
            </h2>
            <button
              type="button"
              class="btn-close btn-close-white"
              aria-label="Закрыть посадочный сертификат"
              @click="$emit('close')"
            ></button>
          </div>
          <div class="modal-body p-4">
            <div class="border border-secondary border-opacity-50 p-4 rounded text-center mb-4">
              <div class="text-uppercase letter-spacing-2 fs-7 text-muted-custom mb-1">Маршрут экспедиции</div>
              <div class="fs-4 fw-bold text-main mb-3">
                {{ flight.origin || 'EAR' }} &rarr; {{ flight.destination }}
              </div>

              <div class="row g-3 text-start border-top border-secondary border-opacity-25 pt-3">
                <div class="col-6">
                  <span class="text-muted-custom fs-7 d-block">Пассажир:</span>
                  <span class="text-main fw-medium fs-7">{{ userName }}</span>
                </div>
                <div class="col-6">
                  <span class="text-muted-custom fs-7 d-block">ID Досье:</span>
                  <span class="text-main fw-medium fs-7">{{ userCode }}</span>
                </div>
                <div class="col-6">
                  <span class="text-muted-custom fs-7 d-block">Шлюз вылета:</span>
                  <span class="text-main fw-medium fs-7">{{ flight.gate || 'Gateway A-12' }}</span>
                </div>
                <div class="col-6">
                  <span class="text-muted-custom fs-7 d-block">Каюта / Модуль:</span>
                  <span class="text-main fw-medium fs-7">{{ flight.cabin || 'Каюта 1-й категории' }}</span>
                </div>
              </div>
            </div>

            <div class="text-center">
              <i class="bi bi-upc-scan text-main display-4 d-block mb-2" style="letter-spacing: 5px;" aria-hidden="true"></i>
              <span class="fs-7 text-muted-custom letter-spacing-2">
                SERIAL NO: {{ flight.serialNo || 'NT-DEFAULT' }}
              </span>
            </div>
          </div>
          <div class="modal-footer border-top border-secondary border-opacity-25 p-3">
            <button type="button" class="btn btn-accent fs-7 py-2 w-100" @click="$emit('close')">
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  flight: Object,
  userName: String,
  userCode: String
})

defineEmits(['close'])
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .modal-dialog,
.modal-fade-leave-active .modal-dialog {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.modal-fade-enter-from .modal-dialog,
.modal-fade-leave-to .modal-dialog {
  transform: translateY(-20px) scale(0.96);
  opacity: 0;
}
</style>