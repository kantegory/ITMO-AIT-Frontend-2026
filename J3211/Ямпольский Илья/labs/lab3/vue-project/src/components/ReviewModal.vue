<template>
  <div v-if="modelValue" class="modal-backdrop" @click="closeModal">
    <div class="modal-content-wrapper" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Оставить отзыв</h2>
        <button type="button" class="btn-close" @click="closeModal" aria-label="Закрыть"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label">Ваша оценка</label>
          <div class="rating-select d-flex gap-2">
            <button
              v-for="i in 5"
              :key="i"
              type="button"
              :class="['btn', 'btn-sm', rating === i ? 'btn-warning active' : 'btn-outline-warning']"
              @click="setRating(i)"
            >
              {{ i }}
            </button>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Ваш отзыв</label>
          <textarea class="form-control" v-model="reviewText" rows="4" placeholder="Напишите ваш отзыв..."></textarea>
        </div>
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" v-model="anonymous" id="reviewAnon">
          <label class="form-check-label" for="reviewAnon">Опубликовать анонимно</label>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">Отмена</button>
        <button type="button" class="btn btn-primary" @click="submitReview">Отправить</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ReviewModal',
  props: {
    modelValue: { type: Boolean, default: false },
    eventId: { type: Number, required: true }
  },
  emits: ['update:modelValue', 'submit-review'],
  setup(props, { emit }) {
    const auth = useAuthStore()
    const rating = ref(0)
    const reviewText = ref('')
    const anonymous = ref(false)

    const setRating = (value) => {
      rating.value = value
    }

    const closeModal = () => {
      emit('update:modelValue', false)
      rating.value = 0
      reviewText.value = ''
      anonymous.value = false
    }

    const submitReview = async () => {
      if (!auth.isAuthenticated) {
        alert('Для оставления отзыва необходимо войти в аккаунт!')
        return
      }
      if (rating.value === 0) {
        alert('Выберите оценку!')
        return
      }
      if (!reviewText.value.trim()) {
        alert('Напишите текст отзыва!')
        return
      }

      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const reviewData = {
          eventId: props.eventId,
          userId: user.id,
          userName: anonymous.value ? 'Аноним' : `${user.firstName} ${user.lastName}`,
          rating: rating.value,
          text: reviewText.value.trim(),
          anonymous: anonymous.value,
          date: new Date().toISOString().split('T')[0]
        }

        const response = await fetch('http://localhost:3000/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData)
        })

        if (response.ok) {
          alert('Спасибо за отзыв!')
          emit('submit-review', reviewData)
          closeModal()
        } else {
          alert('Ошибка отправки отзыва')
        }
      } catch (error) {
        console.error('Ошибка:', error)
        alert('Ошибка отправки отзыва: ' + error.message)
      }
    }

    return {
      rating,
      reviewText,
      anonymous,
      setRating,
      closeModal,
      submitReview
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
  max-width: 500px;
  width: 100%;
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

.modal-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.rating-select .btn {
  width: 40px;
  height: 40px;
  font-weight: bold;
  font-size: 1.1rem;
}

</style>
