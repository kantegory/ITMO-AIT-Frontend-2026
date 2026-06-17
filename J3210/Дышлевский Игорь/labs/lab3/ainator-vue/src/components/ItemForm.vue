<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit', 'cancel'])

const type = ref('model')
const name = ref('')
const description = ref('')
const framework = ref('')
const license = ref('MIT')
const task = ref('CV')

function handleSubmit() {
    emit('submit', {
        type: type.value,
        name: name.value,
        description: description.value,
        framework: framework.value || null,
        license: license.value,
        task: task.value,
    })
    name.value = ''
    description.value = ''
    framework.value = ''
}
</script>

<template>
    <form class="card form" @submit.prevent="handleSubmit">
        <div class="grid">
            <label>Тип
                <select v-model="type" class="select">
                    <option value="model">Модель</option>
                    <option value="dataset">Датасет</option>
                </select>
            </label>
            <label>Название
                <input v-model="name" required class="input" />
            </label>
            <label>Фреймворк
                <select v-model="framework" class="select">
                    <option value="">—</option>
                    <option value="PyTorch">PyTorch</option>
                    <option value="TensorFlow">TensorFlow</option>
                </select>
            </label>
            <label>Лицензия
                <select v-model="license" class="select">
                    <option value="MIT">MIT</option>
                    <option value="Apache-2.0">Apache-2.0</option>
                </select>
            </label>
            <label>Задача
                <select v-model="task" class="select">
                    <option value="CV">Computer Vision</option>
                    <option value="NLP">NLP</option>
                </select>
            </label>
            <label class="full">Описание
                <textarea v-model="description" class="input" rows="3" placeholder="Краткое описание модели или датасета"></textarea>
            </label>
        </div>
        <div class="actions">
            <button type="submit" class="btn">Создать</button>
            <button type="button" class="btn btn-alt" @click="emit('cancel')">Отмена</button>
        </div>
    </form>
</template>

<style scoped>
.form { 
    margin-bottom: 1.5rem; 
}
.grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr 1fr; 
    gap: 1rem; 
}
.full { 
    grid-column: 1 / -1; 
}
.actions {
    display: flex; 
    gap: 0.5rem; 
    margin-top: 1rem; 
}
</style>