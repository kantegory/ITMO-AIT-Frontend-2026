<template>
  <div v-if="modelValue" class="modal-backdrop" @click="closeModal">
    <div class="modal-content-wrapper" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">{{ event?.title }}</h2>
        <button type="button" class="btn-close" @click="closeModal" aria-label="Закрыть"></button>
      </div>
      <div class="modal-body">
        <img :src="event?.imageUrl || 'https://placebear.com/800/400'" class="img-fluid rounded mb-3 w-100" :alt="event?.title" style="max-height: 400px; object-fit: cover;">
        <div class="row">
          <div class="col-lg-8">
            <p class="text-muted">{{ event?.type || 'Мероприятие' }}</p>
            <p class="text-muted">Место: {{ event?.city }}{{ event?.venue ? ', ' + event?.venue : '' }}</p>
            <p class="text-muted">{{ event?.description || '' }}</p>
            <h3 class="mt-4">Схема зала</h3>
            <div class="seat-map" ref="seatMapRef"></div>
            <div class="mt-2 d-flex gap-3 small flex-wrap">
              <span><span class="legend-seat available"></span>Свободно</span>
              <span><span class="legend-seat selected"></span>Выбрано</span>
              <span><span class="legend-seat sold"></span>Продано</span>
            </div>
            <h3 class="mt-4">Отзывы</h3>
            <div id="reviewsContainer">
              <p v-if="reviews.length === 0" class="text-muted small">Пока нет отзывов</p>
              <div v-for="review in reviews" :key="review.id" class="card bg-light border-0 mb-2">
                <div class="card-body p-2">
                  <small><strong>{{ review.anonymous ? 'Аноним' : review.userName }}</strong> [{{ review.rating }}/5]</small>
                  <p class="mb-0 small">{{ review.text }}</p>
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-outline-primary btn-sm mt-2" @click="$emit('open-review', event?.id)">Оставить отзыв</button>
          </div>
          <div class="col-lg-4">
            <div class="card bg-light text-center">
              <div class="card-body">
                <h3 class="text-muted">Цена</h3>
                <p class="text-primary">{{ formatPrice(event?.price || 0) }} ₽</p>
                <div class="mb-2"><small>Выбрано мест: </small><strong>{{ selectedSeats.length }}</strong></div>
                <div class="mb-3"><small>Итого: </small><strong class="text-success">{{ formatPrice(totalPrice) }} ₽</strong></div>
                <button type="button" class="btn btn-success w-100" @click="buyTickets">Купить билеты</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useFormat } from '@/composables/useFormat'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'EventModal',
  props: {
    event: { type: Object, required: true },
    modelValue: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'buy-tickets', 'open-review'],
  setup(props, { emit }) {
    const { formatPrice } = useFormat()
    const auth = useAuthStore()
    const seatMapRef = ref(null)
    const selectedSeats = ref([])
    const soldSeats = ref([])
    const reviews = ref([])
    ref(false);
    const totalPrice = computed(() => selectedSeats.value.length * (props.event?.price || 0))

    const loadReviews = async () => {
      if (!props.event?.id) {
        reviews.value = []
        return
      }
      try {
        console.log('📥 Загрузка отзывов для eventId:', props.event.id)
        const response = await fetch(`http://localhost:3000/reviews?eventId=${props.event.id}`)
        const data = await response.json()
        reviews.value = data || []
        console.log('✅ Отзывы загружены:', reviews.value.length)
      } catch (error) {
        console.error('❌ Ошибка загрузки отзывов:', error)
        reviews.value = []
      }
    }

    const loadSoldSeats = async () => {
      try {
        const response = await fetch(`http://localhost:3000/tickets?eventId=${props.event.id}`)
        const tickets = await response.json()
        const sold = []
        tickets.forEach(ticket => {
          if (ticket.seats) {
            const seatNumbers = ticket.seats.split(',').map(s => parseInt(s.trim()))
            sold.push(...seatNumbers)
          }
        })
        soldSeats.value = sold
        console.log('✅ Проданные места:', soldSeats.value)
      } catch (error) {
        console.error('❌ Ошибка загрузки мест:', error)
        soldSeats.value = []
      }
    }

    const generateSeatMap = async () => {
      if (!seatMapRef.value || !props.event?.id) {
        console.log('❌ generateSeatMap: нет seatMapRef или event.id')
        return
      }

      console.log('🎫 generateSeatMap: начинаем для event', props.event.id, 'capacity:', props.event.capacity)

      await nextTick()

      const capacity = props.event.capacity || 50
      selectedSeats.value = []

      await loadSoldSeats()

      seatMapRef.value.innerHTML = ''

      for (let i = 1; i <= capacity; i++) {
        const button = document.createElement('button')
        button.type = 'button'
        button.className = `seat ${soldSeats.value.includes(i) ? 'sold' : 'available'}`
        button.dataset.seat = i
        button.textContent = i
        button.style.cssText = `
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: 2px solid var(--legend-border);
          cursor: ${soldSeats.value.includes(i) ? 'not-allowed' : 'pointer'};
          background: ${soldSeats.value.includes(i) ? 'var(--seat-sold)' : 'var(--seat-available)'};
          color: #ffffff;
          font-size: 12px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        `

        if (!soldSeats.value.includes(i)) {
          button.onclick = () => toggleSeat(i)
        }

        seatMapRef.value.appendChild(button)
      }

      console.log('✅ generateSeatMap: завершено, создано мест:', capacity)
    }

    const toggleSeat = (seatNumber) => {
      const button = seatMapRef.value?.querySelector(`button[data-seat="${seatNumber}"]`)
      if (!button || button.classList.contains('sold')) return

      const index = selectedSeats.value.indexOf(seatNumber)
      if (index > -1) {
        selectedSeats.value.splice(index, 1)
        button.classList.remove('selected')
        button.classList.add('available')
        button.style.background = 'var(--seat-available)'
      } else {
        selectedSeats.value.push(seatNumber)
        button.classList.remove('available')
        button.classList.add('selected')
        button.style.background = 'var(--seat-selected)'
      }
    }

    const buyTickets = async () => {
      if (!auth.isAuthenticated) {
        alert('Для покупки билетов необходимо войти в аккаунт!')
        return
      }
      if (selectedSeats.value.length === 0) {
        alert('Выберите хотя бы одно место!')
        return
      }

      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const ticketData = {
          eventId: props.event.id,
          eventName: props.event.title,
          userId: user.id,
          seats: selectedSeats.value.join(', '),
          totalPrice: selectedSeats.value.length * props.event.price,
          status: 'active',
          purchaseDate: new Date().toISOString().split('T')[0]
        }

        await fetch('http://localhost:3000/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticketData)
        })

        alert(`Билеты куплены!\nМеста: ${selectedSeats.value.join(', ')}\nСумма: ${formatPrice(ticketData.totalPrice)} ₽`)
        emit('buy-tickets', ticketData)
        closeModal()
      } catch (error) {
        console.error('Ошибка покупки:', error)
        alert('Ошибка покупки билетов')
      }
    }

    const closeModal = () => {
      emit('update:modelValue', false)
      selectedSeats.value = []
    }

    onMounted(async () => {
      console.log('🔧 onMounted: modelValue =', props.modelValue, 'event.id =', props.event?.id)
      if (props.modelValue && props.event?.id) {
        await nextTick()
        await loadReviews()
        await generateSeatMap()
      }
    })

    watch(() => props.modelValue, async (newVal, oldVal) => {
      console.log('👁 watch modelValue:', oldVal, '→', newVal)
      if (newVal && !oldVal && props.event?.id) {
        await nextTick()
        await loadReviews()
        await generateSeatMap()
      }
    })

    watch(() => props.event?.id, async (newId, oldId) => {
      console.log('👁 watch event.id:', oldId, '→', newId)
      if (newId && newId !== oldId && props.modelValue) {
        await nextTick()
        await loadReviews()
        await generateSeatMap()
      }
    })

    return {
      seatMapRef,
      selectedSeats,
      reviews,
      totalPrice,
      formatPrice,
      closeModal,
      buyTickets
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 20px;
}

.modal-content-wrapper {
  background: var(--bg-secondary);
  border-radius: 10px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
}

.modal-body {
  padding: 1rem;
}

.seat-map {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 20px;
  background: var(--border-light);
  border-radius: 10px;
  justify-content: flex-start;
  width: 100%;
  min-height: 200px;
}

.legend-seat {
  width: 18px;
  height: 18px;
  border-radius: 3px;
  display: inline-block;
  margin-right: 4px;
  vertical-align: middle;
  border: 1px solid var(--legend-border);
}

.legend-seat.available {
  background: var(--seat-available) !important;
}

.legend-seat.selected {
  background: var(--seat-selected) !important;
}

.legend-seat.sold {
  background: var(--seat-sold) !important;
}
</style>
