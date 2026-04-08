<template>
  <div v-if="modelValue" class="modal-backdrop" @click="closeModal">
    <div class="modal-content-wrapper" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Создать событие</h2>
        <button type="button" class="btn-close" @click="closeModal" aria-label="Закрыть"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label class="form-label">Название</label>
            <input type="text" v-model="form.title" class="form-control" placeholder="Название мероприятия" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Тип</label>
            <select v-model="form.type" class="form-select">
              <option value="Концерт">Концерт</option>
              <option value="Театр">Театр</option>
              <option value="Выставка">Выставка</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Город</label>
            <select v-model="form.city" class="form-select">
              <option value="Москва">Москва</option>
              <option value="СПб">СПб</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Место проведения</label>
            <input type="text" v-model="form.venue" class="form-control" placeholder="Адрес места проведения">
          </div>
          <div class="mb-3">
            <label class="form-label">Описание</label>
            <textarea v-model="form.description" class="form-control" rows="3" placeholder="Описание мероприятия"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Ссылка на фото</label>
            <input type="url" v-model="form.imageUrl" class="form-control" placeholder="https://example.com/image.jpg">
          </div>
          <div class="mb-3">
            <label class="form-label">Дата</label>
            <input type="date" v-model="form.date" class="form-control" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Цена</label>
            <input type="number" v-model="form.price" class="form-control" placeholder="500" min="0" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Количество мест</label>
            <input type="number" v-model="form.capacity" class="form-control" placeholder="50" value="50" min="1">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">Отмена</button>
        <button type="button" class="btn btn-primary" @click="submitForm">Создать</button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'

export default {
  name: 'CreateEventModal',
  props: {
    modelValue: Boolean
  },
  emits: ['update:modelValue', 'event-created'],
  setup(props, { emit }) {
    const auth = useAuthStore()
    const eventsStore = useEventsStore()

    const form = reactive({
      title: '',
      type: 'Концерт',
      city: 'Москва',
      venue: '',
      description: '',
      imageUrl: '',
      date: '',
      price: '',
      capacity: '50'
    })

    const closeModal = () => {
      emit('update:modelValue', false)
      resetForm()
    }

    const resetForm = () => {
      form.title = ''
      form.type = 'Концерт'
      form.city = 'Москва'
      form.venue = ''
      form.description = ''
      form.imageUrl = ''
      form.date = ''
      form.price = ''
      form.capacity = '50'
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const parts = dateString.split('-')
      if (parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`
      }
      return dateString
    }

    const submitForm = async () => {
      if (!form.title || !form.date || !form.price) {
        alert('Заполните обязательные поля: Название, Дата, Цена')
        return
      }

      const user = auth.user
      if (!user) {
        alert('Пользователь не авторизован')
        return
      }

      const eventData = {
        title: form.title,
        type: form.type,
        city: form.city,
        venue: form.venue || '',
        description: form.description || '',
        imageUrl: form.imageUrl || 'https://placebear.com/800/400',
        date: formatDate(form.date),
        price: parseInt(form.price),
        capacity: parseInt(form.capacity) || 50,
        userId: user.id
      }

      try {
        await eventsStore.createEvent(eventData)
        alert('Событие создано! Теперь оно доступно на главной странице и в поиске.')
        emit('event-created')
        closeModal()
      } catch (error) {
        alert('Ошибка создания события: ' + error.message)
      }
    }

    return {
      form,
      closeModal,
      submitForm
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
  max-width: 600px;
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

.modal-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
