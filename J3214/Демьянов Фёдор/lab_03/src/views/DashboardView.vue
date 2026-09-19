<template>
  <div>
    <TheNavbar />

    <main id="main-content" class="container-fluid py-5 custom-container px-4 px-md-5">
      <h1 class="visually-hidden">Личный кабинет исследователя NovaTransit</h1>

      <div class="row g-4">
        <!-- Посадочный талон -->
        <div class="col-lg-8 d-flex flex-column">
          <ActiveFlightCard
            :flight="activeFlight"
            @open-ticket="isTicketOpen = true"
          />
        </div>

        <!-- Досье исследователя -->
        <div class="col-lg-4">
          <UserProfileCard :user="user" />
        </div>

        <!-- Предполетные нормативы -->
        <div class="col-lg-6">
          <TrainingProgress :progress="user?.trainingProgress" />
        </div>

        <!-- Системы жизнеобеспечения каюты -->
        <div class="col-lg-6">
          <CabinControls
            :settings="user?.cabinSettings"
            @notify="showNotification"
          />
        </div>

        <!-- Внешний шлюз NASA APOD -->
        <div class="col-lg-12">
          <NasaApodCard />
        </div>

        <!-- Бортовой журнал -->
        <div class="col-lg-12">
          <FlightHistoryTable :bookings="bookings" />
        </div>
      </div>

      <!-- Модальное окно билета -->
      <TicketModal
        :is-open="isTicketOpen"
        :flight="activeFlight"
        :user-name="user?.name"
        :user-code="user?.code"
        @close="isTicketOpen = false"
      />

      <!-- Всплывающее уведомление систем каюты (Toast) -->
      <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1100;">
        <Transition name="toast-fade">
          <div
            v-if="toastMessage"
            class="toast show glass-panel border border-secondary text-main"
            role="status"
            aria-live="polite"
          >
            <div class="toast-header border-bottom border-secondary border-opacity-25 bg-transparent text-main">
              <i class="bi bi-cpu me-2 text-secondary" aria-hidden="true"></i>
              <strong class="me-auto fs-7 text-uppercase letter-spacing-2">Бортовой компьютер</strong>
              <small class="text-muted-custom">только что</small>
              <button
                type="button"
                class="btn-close btn-close-white"
                aria-label="Закрыть уведомление"
                @click="toastMessage = ''"
              ></button>
            </div>
            <div class="toast-body fs-7">
              {{ toastMessage }}
            </div>
          </div>
        </Transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TheNavbar from '../components/common/TheNavbar.vue'
import ActiveFlightCard from '../components/dashboard/ActiveFlightCard.vue'
import UserProfileCard from '../components/dashboard/UserProfileCard.vue'
import TrainingProgress from '../components/dashboard/TrainingProgress.vue'
import CabinControls from '../components/dashboard/CabinControls.vue'
import NasaApodCard from '../components/dashboard/NasaApodCard.vue'
import FlightHistoryTable from '../components/dashboard/FlightHistoryTable.vue'
import TicketModal from '../components/dashboard/TicketModal.vue'
import { useAuth } from '../composables/useAuth'
import { bookingsApi } from '../api/bookings'

const { user, refreshUserData } = useAuth()

const bookings = ref([])
const isTicketOpen = ref(false)
const toastMessage = ref('')
let toastTimer = null

const activeFlight = computed(() => {
  if (bookings.value.length === 0) return null
  return bookings.value[bookings.value.length - 1]
})

const showNotification = (msg) => {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

const loadBookings = async () => {
  if (!user.value) return
  try {
    bookings.value = await bookingsApi.getByUserId(user.value.id)
  } catch (err) {
    console.error('Ошибка загрузки полетных манифестов:', err)
  }
}

onMounted(async () => {
  await refreshUserData()
  await loadBookings()
})
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>