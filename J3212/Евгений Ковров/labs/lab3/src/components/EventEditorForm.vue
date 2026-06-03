<template>
  <section class="organizer-panel organizer-panel--editor">
    <div class="organizer-panel__header">
      <div>
        <p class="eyebrow">{{ mode === 'edit' ? 'Редактирование' : 'Новое событие' }}</p>
        <h2 class="organizer-panel__title">
          {{ mode === 'edit' ? 'Редактировать событие' : 'Создать событие' }}
        </h2>
      </div>
      <button class="app-nav__button" type="button" @click="$emit('cancel')">Закрыть</button>
    </div>

    <div v-if="message" class="state-box" :class="messageClass">{{ message }}</div>

    <form class="organizer-form" @submit.prevent="$emit('submit')">
      <div class="organizer-form__grid">
        <label class="auth-form__field">
          <span>Название</span>
          <input v-model="localForm.title" type="text" required />
        </label>

        <label class="auth-form__field">
          <span>Тип</span>
          <select v-model="localForm.category" class="organizer-form__select">
            <option>Концерт</option>
            <option>Стендап</option>
            <option>Спорт</option>
            <option>Выставка</option>
            <option>Театр</option>
            <option>Фестиваль</option>
          </select>
        </label>

        <label class="auth-form__field">
          <span>Город</span>
          <input v-model="localForm.city" type="text" required />
        </label>

        <label class="auth-form__field">
          <span>Площадка</span>
          <input v-model="localForm.venue" type="text" required />
        </label>

        <label class="auth-form__field">
          <span>Дата</span>
          <input v-model="localForm.date" type="date" required />
        </label>

        <label class="auth-form__field">
          <span>Время</span>
          <input v-model="localForm.time" type="time" required />
        </label>

        <label class="auth-form__field">
          <span>Вместимость</span>
          <input v-model.number="localForm.capacity" type="number" min="1" required />
        </label>

        <label class="auth-form__field">
          <span>Цена от</span>
          <input v-model.number="localForm.price" type="number" min="0" required />
        </label>

        <label class="auth-form__field">
          <span>Возраст</span>
          <select v-model="localForm.age" class="organizer-form__select">
            <option>18+</option>
            <option>16+</option>
            <option>12+</option>
            <option>0+</option>
          </select>
        </label>

        <label class="auth-form__field organizer-form__field--wide">
          <span>Изображение</span>
          <input
            v-model="localForm.image"
            type="text"
            placeholder="https://placehold.co/800x500/1f2633/e6edf6?text=Событие"
          />
        </label>

        <label class="auth-form__field organizer-form__field--wide">
          <span>Описание</span>
          <textarea v-model="localForm.description" class="organizer-form__textarea" rows="5" />
        </label>
      </div>

      <div class="organizer-form__actions">
        <button class="button-link button-link--ghost" type="button" @click="$emit('cancel')">
          Отмена
        </button>
        <button class="button-link" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Сохраняем...' : submitText }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const localForm = defineModel('form', {
  type: Object,
  required: true
});

defineEmits(['submit', 'cancel']);

const props = defineProps({
  mode: {
    type: String,
    default: 'create'
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  messageType: {
    type: String,
    default: ''
  }
});

const submitText = computed(() => props.mode === 'edit' ? 'Сохранить изменения' : 'Сохранить');

const messageClass = computed(() => {
  if (props.messageType === 'error') {
    return 'state-box--error';
  }

  if (props.messageType === 'success') {
    return 'state-box--success';
  }

  return '';
});
</script>
