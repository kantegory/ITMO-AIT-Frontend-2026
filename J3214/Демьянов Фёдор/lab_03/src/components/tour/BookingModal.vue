<template>
    <Transition name="modal-fade">
        <div
            v-if="isOpen"
            class="modal fade show d-block"
            tabindex="-1"
            role="dialog"
            aria-labelledby="bookingModalTitle"
            aria-modal="true"
            style="background-color: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px);"
        >
            <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content glass-panel border border-secondary" style="background-color: var(--bg-surface);">
                <div class="modal-header border-bottom border-secondary border-opacity-25">
                <h2 class="modal-title fs-6 text-uppercase letter-spacing-2 text-main" id="bookingModalTitle">
                    Бронирование миссии
                </h2>
                <button
                    type="button"
                    class="btn-close btn-close-white"
                    aria-label="Закрыть окно бронирования"
                    @click="$emit('close')"
                ></button>
                </div>

                <form @submit.prevent="submitBooking" :class="{ 'was-validated': wasValidated }" novalidate>
                <div class="modal-body p-4">
                    <div class="mb-3">
                    <label for="cadetName" class="form-label">ФИО исследователя</label>
                    <input
                        type="text"
                        class="form-control glass-input shadow-none"
                        id="cadetName"
                        v-model="form.name"
                        placeholder="Иванов Иван Иванович"
                        required
                    >
                    <div class="invalid-feedback fs-7">Укажите ваши паспортные данные.</div>
                    </div>

                    <div class="mb-3">
                    <label for="cadetEmail" class="form-label">Бортовой Email</label>
                    <input
                        type="email"
                        class="form-control glass-input shadow-none"
                        id="cadetEmail"
                        v-model="form.email"
                        placeholder="cadet@novatransit.com"
                        required
                    >
                    <div class="invalid-feedback fs-7">Укажите корректный email для отправки билета.</div>
                    </div>

                    <div class="mb-4">
                    <label for="flightDate" class="form-label">Стартовое окно</label>
                    <select
                        class="form-select glass-input shadow-none"
                        id="flightDate"
                        v-model="form.date"
                        required
                    >
                        <option value="" disabled>Выберите окно старта</option>
                        <option v-for="d in tour.dates" :key="d" :value="d">{{ d }}</option>
                    </select>
                    <div class="invalid-feedback fs-7">Выберите дату запуска.</div>
                    </div>

                    <fieldset class="border-top border-secondary border-opacity-25 pt-3 mb-3">
                    <legend class="form-label d-block mb-2 float-none fs-7 p-0">Дополнительные модули</legend>
                    <div class="form-check mb-2">
                        <input
                        class="form-check-input shadow-none"
                        type="checkbox"
                        id="optEva"
                        v-model="form.optEva"
                        >
                        <label class="form-check-label fs-7 text-main" for="optEva">
                        Шлюзование и выход в открытый космос (+150 000 $)
                        </label>
                    </div>
                    <div class="form-check">
                        <input
                        class="form-check-input shadow-none"
                        type="checkbox"
                        id="optPhoto"
                        v-model="form.optPhoto"
                        >
                        <label class="form-check-label fs-7 text-main" for="optPhoto">
                        Съемка внешними камерами челнока 8K (+50 000 $)
                        </label>
                    </div>
                    </fieldset>

                    <div class="d-flex justify-content-between align-items-center border-top border-secondary border-opacity-25 pt-3">
                    <span class="text-muted-custom fs-7 text-uppercase letter-spacing-2">Итоговая стоимость:</span>
                    <span class="fs-5 fw-bold text-main" aria-live="polite">
                        {{ totalPrice.toLocaleString('ru-RU') }} $
                    </span>
                    </div>
                </div>

                <div class="modal-footer border-top border-secondary border-opacity-25 p-3">
                    <button type="button" class="btn btn-glass fs-7 py-2" @click="$emit('close')">
                    Отмена
                    </button>
                    <button type="submit" class="btn btn-accent fs-7 py-2 px-4" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Оформление...' : 'Подтвердить бронь' }}
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>
    </Transition>
</template>



<script setup>
import { reactive, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { bookingsApi } from '../../api/bookings'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  tour: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])
const router = useRouter()
const { user, isAuthenticated } = useAuth()

const isSubmitting = ref(false)
const wasValidated = ref(false)

const form = reactive({
  name: user.value?.name || '',
  email: user.value?.email || '',
  date: '',
  optEva: false,
  optPhoto: false
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    form.name = user.value?.name || ''
    form.email = user.value?.email || ''
    form.date = props.tour.dates?.[0] || ''
    form.optEva = false
    form.optPhoto = false
    wasValidated.value = false
  }
})

const totalPrice = computed(() => {
  let total = props.tour.price || 0
  if (form.optEva) total += 150000
  if (form.optPhoto) total += 50000
  return total
})

const submitBooking = async () => {
  if (!form.name || !form.email || !form.date) {
    wasValidated.value = true
    return
  }

  isSubmitting.value = true
  const serialNumber = `NT-${Math.floor(1000 + Math.random() * 9000)}-2026-${props.tour.code.replace(/[^a-zA-Z0-9]/g, '')}`

  const newBooking = {
    userId: user.value?.id || null,
    tourId: props.tour.id,
    tourCode: props.tour.code.split(' // ')[0] || props.tour.code,
    route: `Земля → ${props.tour.title.split(' ')[0]}`,
    origin: 'EAR',
    originName: 'Земля (КК)',
    destination: props.tour.destination?.toUpperCase() || 'ORB',
    destinationName: props.tour.title,
    date: form.date,
    countdown: '30 дн. 10:00',
    ship: props.tour.ship,
    gate: 'Gateway A-12',
    cabin: 'Каюта 1-й категории',
    status: 'Ожидает старта',
    statusBadge: 'badge-gold',
    totalPrice: totalPrice.value,
    serialNo: serialNumber,
    active: true
  }

  try {
    await bookingsApi.create(newBooking)
    emit('close')
    alert(`Место успешно забронировано! Номер сертификата: ${serialNumber}.`)
    if (isAuthenticated.value) {
      router.push('/dashboard')
    }
  } catch (err) {
    alert(`Ошибка бронирования: ${err.message}`)
  } finally {
    isSubmitting.value = false
  }
}
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
  transform: translateY(-25px) scale(0.96);
  opacity: 0;
}
</style>