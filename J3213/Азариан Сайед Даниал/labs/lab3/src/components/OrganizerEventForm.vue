<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['create'])
const wasValidated = ref(false)

const form = reactive({
  name: '',
  category: '',
  dateIso: '',
  city: '',
  venue: '',
  price: '',
  time: '',
  age: '',
  posterImage: '',
  description: '',
})

function resetForm() {
  Object.assign(form, {
    name: '',
    category: '',
    dateIso: '',
    city: '',
    venue: '',
    price: '',
    time: '',
    age: '',
    posterImage: '',
    description: '',
  })
  wasValidated.value = false
}

function handleSubmit(event) {
  wasValidated.value = true

  if (!event.currentTarget.checkValidity()) {
    return
  }

  emit('create', { ...form, price: Number(form.price), resetForm })
}
</script>

<template>
  <form class="needs-validation" :class="{ 'was-validated': wasValidated }" novalidate @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label class="form-label" for="eventNameInput">Название</label>
      <input id="eventNameInput" v-model.trim="form.name" class="form-control" required minlength="3" placeholder="Например, Summer Indie Fest" />
      <div class="invalid-feedback">Введите название события.</div>
    </div>

    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label" for="eventCategoryInput">Категория</label>
        <select id="eventCategoryInput" v-model="form.category" class="form-select" required>
          <option value="">Выберите</option>
          <option>Концерт</option>
          <option>Театр</option>
          <option>Спорт</option>
          <option>Шоу</option>
          <option>Образование</option>
        </select>
        <div class="invalid-feedback">Выберите категорию.</div>
      </div>
      <div class="col-md-6">
        <label class="form-label" for="eventDateInput">Дата</label>
        <input id="eventDateInput" v-model="form.dateIso" class="form-control" type="date" required />
        <div class="invalid-feedback">Укажите дату.</div>
      </div>
    </div>

    <div class="row g-3 mt-0">
      <div class="col-md-6">
        <label class="form-label" for="eventCityInput">Город</label>
        <input id="eventCityInput" v-model.trim="form.city" class="form-control" required placeholder="Москва" />
        <div class="invalid-feedback">Укажите город.</div>
      </div>
      <div class="col-md-6">
        <label class="form-label" for="eventVenueInput">Площадка</label>
        <input id="eventVenueInput" v-model.trim="form.venue" class="form-control" required placeholder="VK Stadium" />
        <div class="invalid-feedback">Укажите площадку.</div>
      </div>
    </div>

    <div class="row g-3 mt-0">
      <div class="col-md-6">
        <label class="form-label" for="eventPriceInput">Цена билета, руб.</label>
        <input id="eventPriceInput" v-model="form.price" class="form-control" type="number" min="1" required />
        <div class="invalid-feedback">Укажите цену билета.</div>
      </div>
      <div class="col-md-6">
        <label class="form-label" for="eventTimeInput">Время</label>
        <input id="eventTimeInput" v-model="form.time" class="form-control" type="time" required />
        <div class="invalid-feedback">Укажите время начала.</div>
      </div>
    </div>

    <div class="row g-3 mt-0">
      <div class="col-md-6">
        <label class="form-label" for="eventAgeInput">Возрастное ограничение</label>
        <select id="eventAgeInput" v-model="form.age" class="form-select" required>
          <option value="">Выберите</option>
          <option>0+</option>
          <option>6+</option>
          <option>12+</option>
          <option>16+</option>
          <option>18+</option>
        </select>
        <div class="invalid-feedback">Укажите возрастное ограничение.</div>
      </div>
      <div class="col-md-6">
        <label class="form-label" for="eventPosterInput">Фотография (необязательно)</label>
        <input id="eventPosterInput" v-model.trim="form.posterImage" class="form-control" type="url" placeholder="https://example.com/poster.jpg" />
      </div>
    </div>

    <div class="mt-3">
      <label class="form-label" for="eventDescriptionInput">Описание</label>
      <textarea
        id="eventDescriptionInput"
        v-model.trim="form.description"
        class="form-control"
        rows="4"
        required
        minlength="20"
        placeholder="Кратко расскажите о программе мероприятия, формате и особенностях."
      ></textarea>
      <div class="invalid-feedback">Добавьте описание (минимум 20 символов).</div>
    </div>

    <button class="btn btn-primary w-100 mt-4" type="submit">Создать событие</button>
  </form>
</template>
