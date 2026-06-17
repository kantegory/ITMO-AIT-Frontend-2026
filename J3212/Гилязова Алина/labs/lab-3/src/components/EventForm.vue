<template>
  
  <div
    ref="modalEl"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="eventFormTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <form @submit.prevent="onSubmit" novalidate>
          <div class="modal-header">
            <h5 id="eventFormTitle" class="modal-title">
              {{ isEdit ? 'Редактирование мероприятия' : 'Новое мероприятие' }}
            </h5>
            <button type="button" class="btn-close" aria-label="Закрыть форму" @click="hide" />
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="eventTitle" class="form-label">Название мероприятия *</label>
                <input id="eventTitle" v-model="form.title" type="text" class="form-control">
              </div>
              <div class="col-md-6">
                <label for="eventType" class="form-label">Тип мероприятия *</label>
                <select id="eventType" v-model="form.type" class="form-select">
                  <option v-for="option in typeOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="eventCity" class="form-label">Город *</label>
                <input id="eventCity" v-model="form.city" type="text" class="form-control" autocomplete="address-level2">
              </div>
              <div class="col-md-4">
                <label for="eventDate" class="form-label">Дата *</label>
                <input id="eventDate" v-model="form.date" type="text" class="form-control" placeholder="Например: 15 апреля">
              </div>
              <div class="col-md-4">
                <label for="eventPlace" class="form-label">Место проведения *</label>
                <input id="eventPlace" v-model="form.place" type="text" class="form-control">
              </div>
              <div class="col-12">
                
                <label for="eventImage" class="form-label">
                  Ссылка на изображение
                </label>
                <input
                  id="eventImage"
                  v-model="form.image"
                  type="url"
                  class="form-control"
                  :class="{ 'is-invalid': imageError }"
                  placeholder="https://example.com/photo.jpg"
                >
                <div v-if="imageError" class="invalid-feedback">{{ imageError }}</div>
              </div>
              <div class="col-12">
                <label for="eventDescription" class="form-label">Описание *</label>
                <textarea id="eventDescription" v-model="form.description" class="form-control" rows="4" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="hide">Отмена</button>
            <button type="submit" class="btn btn-success">
              {{ isEdit ? 'Сохранить изменения' : 'Сохранить мероприятие' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

import { Modal } from 'bootstrap'
import useToast from '@/composables/useToast'
import useEventTypes from '@/composables/useEventTypes'
import { isValidImageUrl, isNonEmptyString } from '@/utils/validators'

const emptyForm = () => ({
  title: '',
  type: 'concert',
  city: '',
  date: '',
  place: '',
  image: '',
  description: ''
})

export default {
  name: 'EventForm',

  emits: ['submit'],
  setup() {
    const { showToast } = useToast()
    const { typeOptions } = useEventTypes()
    return { showToast, typeOptions }
  },
  data() {
    return {
      form: emptyForm(),
      modal: null,
      editingId: null,
      imageError: ''
    }
  },
  computed: {
    isEdit() {
      return this.editingId !== null
    }
  },
  watch: {

    'form.image'() {
      this.imageError = ''
    }
  },
  mounted() {
    this.modal = new Modal(this.$refs.modalEl)
  },
  methods: {

    show(eventToEdit = null) {
      if (eventToEdit) {
        this.editingId = eventToEdit.id
        this.form = {
          title: eventToEdit.title || '',
          type: eventToEdit.type || 'concert',

          city: eventToEdit.cityLabel || eventToEdit.city || '',
          date: eventToEdit.date || '',
          place: eventToEdit.place || '',
          image: eventToEdit.image || '',
          description: eventToEdit.description || ''
        }
      } else {
        this.editingId = null
        this.form = emptyForm()
      }
      this.imageError = ''
      this.modal?.show()
    },

    hide() {
      this.modal?.hide()
    },

    onSubmit() {
      const { title, type, city, date, place, image, description } = this.form

      if (
        !isNonEmptyString(title) ||
        !isNonEmptyString(type) ||
        !isNonEmptyString(city) ||
        !isNonEmptyString(date) ||
        !isNonEmptyString(place) ||
        !isNonEmptyString(description)
      ) {
        this.showToast('Заполните обязательные поля формы')
        return
      }

      const imageTrimmed = (image || '').trim()
      if (imageTrimmed && !isValidImageUrl(imageTrimmed)) {
        this.imageError =
          'Введите корректную ссылку (начинается с http:// или https://). ' +
          'Если ссылки нет — оставьте поле пустым, вместо фото будет плашка «Нет фото».'
        this.showToast('Некорректная ссылка на изображение')
        return
      }

      const payload = {
        title: title.trim(),
        type,
        city: city.trim().toLowerCase(),
        cityLabel: city.trim(),
        date: date.trim(),
        place: place.trim(),
        image: imageTrimmed,
        description: description.trim()
      }

      this.$emit('submit', {
        payload,
        id: this.editingId,
        isEdit: this.isEdit
      })
      this.hide()
    }
  }
}

</script>
