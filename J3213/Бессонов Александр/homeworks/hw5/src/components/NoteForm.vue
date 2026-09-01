<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['create'])
const title = ref('')
const content = ref('')
const category = ref('Проект')
const titleInput = ref(null)
const categories = ['Проект', 'Идея', 'Встреча', 'Личное']
const canSubmit = computed(() => title.value.trim() && content.value.trim())

function submitNote() {
  if (!canSubmit.value) return
  emit('create', {
    title: title.value.trim(),
    content: content.value.trim(),
    category: category.value,
  })
  title.value = ''
  content.value = ''
  category.value = 'Проект'
  titleInput.value?.focus()
}
</script>

<template>
  <section id="newNote" class="form-card" aria-labelledby="formTitle">
    <div class="card-heading">
      <span class="card-heading-icon" aria-hidden="true">+</span>
      <div>
        <p class="section-kicker">Быстрая запись</p>
        <h2 id="formTitle">Новая заметка</h2>
      </div>
    </div>

    <form @submit.prevent="submitNote">
      <label class="field-label" for="noteTitle">Заголовок</label>
      <input
        id="noteTitle"
        ref="titleInput"
        v-model="title"
        class="form-control"
        type="text"
        maxlength="72"
        placeholder="Например, план встречи"
        required
      />

      <div class="field-meta">
        <label class="field-label" for="noteContent">Текст заметки</label>
        <span>{{ content.length }}/240</span>
      </div>
      <textarea
        id="noteContent"
        v-model="content"
        class="form-control"
        rows="5"
        maxlength="240"
        placeholder="Запишите важную мысль или задачу..."
        required
      ></textarea>

      <label class="field-label" for="noteCategory">Категория</label>
      <select id="noteCategory" v-model="category" class="form-control">
        <option v-for="item in categories" :key="item" :value="item">{{ item }}</option>
      </select>

      <button class="primary-button" type="submit" :disabled="!canSubmit">
        <span aria-hidden="true">＋</span>Добавить заметку
      </button>
    </form>
  </section>
</template>
