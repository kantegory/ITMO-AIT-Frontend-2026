<template>
  <section>
    <form class="d-flex flex-column flex-sm-row gap-2 mb-4" @submit.prevent="addFile">
      <input v-model.trim="fileName" class="form-control" type="text" placeholder="Название файла" aria-label="Название файла" required />
      <button class="btn btn-outline-black text-nowrap" type="submit">Добавить файл</button>
    </form>

    <p v-if="!files.length" class="text-muted">Нет загруженных файлов</p>

    <div v-for="file in files" :key="file.id" class="file-item">
      <div class="file-info">
        <span class="file-icon" aria-hidden="true">📄</span>
        <div>
          <div class="fw-bold">{{ file.name }}</div>
          <small class="text-muted">{{ file.size }} • {{ file.date }}</small>
        </div>
      </div>
      <button class="btn btn-sm btn-outline-black" type="button" @click="$emit('delete', file.id)">Удалить</button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ files: { type: Array, default: () => [] } })
const emit = defineEmits(['add', 'delete'])
const fileName = ref('')

function addFile() {
  if (!fileName.value) return
  emit('add', fileName.value)
  fileName.value = ''
}
</script>
