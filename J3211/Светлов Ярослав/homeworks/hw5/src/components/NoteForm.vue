<template>
  <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
  <form @submit.prevent="save">
    <div class="mb-3"><label for="title" class="form-label">Заголовок</label>
      <input id="title" v-model="note.title" class="form-control" maxlength="100" required></div>
    <div class="mb-3"><label for="text" class="form-label">Текст заметки</label>
      <textarea id="text" v-model="note.text" class="form-control" rows="5" maxlength="5000" required></textarea></div>
    <button class="btn btn-primary" :disabled="saving">{{ saving ? 'Сохранение…' : 'Сохранить' }}</button>
  </form>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { useNotesStore } from '../stores/notes';
const emit = defineEmits(['saved']);
const store = useNotesStore();
const note = reactive({ title: '', text: '' });
const saving = ref(false);
const error = ref('');
async function save() {
  if (saving.value) return;
  error.value = '';
  if (!note.title.trim() || !note.text.trim()) { error.value = 'Заполните заголовок и текст заметки.'; return; }
  saving.value = true;
  try {
    await store.add({ title: note.title.trim(), text: note.text.trim() });
    note.title = ''; note.text = '';
    emit('saved');
  } catch { error.value = 'Не удалось сохранить заметку. Проверьте запуск API; введённый текст сохранён в форме.'; }
  finally { saving.value = false; }
}
</script>
