<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  note: { type: Object, required: true },
})

const emit = defineEmits(['toggle-completed', 'toggle-pinned', 'update', 'delete'])
const editing = ref(false)
const draftTitle = ref('')
const draftContent = ref('')
const draftCategory = ref('Проект')
const categories = ['Проект', 'Идея', 'Встреча', 'Личное']

const formattedDate = computed(() =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
    .format(new Date(props.note.updatedAt))
    .replace('.', ''),
)

function fillDraft() {
  draftTitle.value = props.note.title
  draftContent.value = props.note.content
  draftCategory.value = props.note.category
}

function startEditing() {
  fillDraft()
  editing.value = true
}

function cancelEditing() {
  editing.value = false
  fillDraft()
}

function saveChanges() {
  if (!draftTitle.value.trim() || !draftContent.value.trim()) return
  emit('update', {
    id: props.note.id,
    title: draftTitle.value.trim(),
    content: draftContent.value.trim(),
    category: draftCategory.value,
  })
  editing.value = false
}

watch(() => props.note, fillDraft, { immediate: true, deep: true })
</script>

<template>
  <article
    class="note-card"
    :class="[
      `category-${note.category.toLocaleLowerCase('ru-RU')}`,
      { completed: note.completed, pinned: note.pinned },
    ]"
  >
    <template v-if="!editing">
      <div class="note-card-top">
        <span class="category-badge"><i></i>{{ note.category }}</span>
        <div class="note-actions">
          <button
            type="button"
            :class="{ active: note.pinned }"
            :aria-label="note.pinned ? 'Открепить заметку' : 'Закрепить заметку'"
            :title="note.pinned ? 'Открепить' : 'Закрепить'"
            @click="$emit('toggle-pinned', note.id)"
          >
            <span aria-hidden="true">◆</span>
          </button>
          <button type="button" aria-label="Редактировать заметку" title="Редактировать" @click="startEditing">
            <span aria-hidden="true">✎</span>
          </button>
          <button
            class="danger-action"
            type="button"
            aria-label="Удалить заметку"
            title="Удалить"
            @click="$emit('delete', note.id)"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>

      <h3>{{ note.title }}</h3>
      <p>{{ note.content }}</p>

      <div class="note-card-footer">
        <button
          class="complete-button"
          type="button"
          :aria-pressed="note.completed"
          @click="$emit('toggle-completed', note.id)"
        >
          <span aria-hidden="true">{{ note.completed ? '✓' : '' }}</span>
          {{ note.completed ? 'Готово' : 'Отметить готовой' }}
        </button>
        <time :datetime="note.updatedAt">{{ formattedDate }}</time>
      </div>
    </template>

    <form v-else class="edit-form" @submit.prevent="saveChanges">
      <div class="edit-form-heading">
        <strong>Редактирование</strong>
        <button type="button" aria-label="Отменить редактирование" @click="cancelEditing">×</button>
      </div>
      <label>
        <span>Заголовок</span>
        <input v-model="draftTitle" class="form-control" maxlength="72" required />
      </label>
      <label>
        <span>Текст</span>
        <textarea v-model="draftContent" class="form-control" rows="4" maxlength="240" required></textarea>
      </label>
      <label>
        <span>Категория</span>
        <select v-model="draftCategory" class="form-control">
          <option v-for="item in categories" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>
      <div class="edit-actions">
        <button class="secondary-button" type="button" @click="cancelEditing">Отмена</button>
        <button class="primary-button compact" type="submit">Сохранить</button>
      </div>
    </form>
  </article>
</template>
