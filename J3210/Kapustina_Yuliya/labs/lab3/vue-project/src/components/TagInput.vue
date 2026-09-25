<template>
  <div>
    <label class="form-label">Метки</label>
    
    <div class="tag-input-group">
      <input
        type="text"
        class="tag-input"
        v-model="newTag"
        placeholder="Введите тег"
        @keypress.enter.prevent="addTag"
      />
      <button type="button" class="tag-add-btn" @click="addTag">
        Добавить
      </button>
    </div>
    
    <div class="d-flex flex-wrap align-items-center">
      <span 
        v-for="tag in tags" 
        :key="tag" 
        class="tag"
      >
        {{ tag }}
        <span class="tag-remove" @click="removeTag(tag)">×</span>
      </span>
    </div>
    
    <small class="text-muted mt-2 d-block">
      <i class="bi bi-info-circle"></i> Нажмите на крестик, чтобы удалить тег
    </small>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const newTag = ref('')
const tags = ref([...props.modelValue])

function addTag() {
  const tagValue = newTag.value.trim().toLowerCase()
  
  if (!tagValue) return
  
  if (tags.value.includes(tagValue)) {
    alert('Такой тег уже добавлен')
    newTag.value = ''
    return
  }
  
  tags.value.push(tagValue)
  emit('update:modelValue', tags.value)
  newTag.value = ''
}

function removeTag(tagToRemove) {
  tags.value = tags.value.filter(t => t !== tagToRemove)
  emit('update:modelValue', tags.value)
}
</script>