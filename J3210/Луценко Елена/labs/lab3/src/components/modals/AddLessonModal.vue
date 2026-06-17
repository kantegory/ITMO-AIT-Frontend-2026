<script setup>
import {reactive} from 'vue'
import {coursesApi} from '@/api'

defineProps(['courses'])

const form = reactive({courseId: '', title: '', description: '', task: '', file: null})

const submit = async () => {
    const course = (await coursesApi.getById(form.courseId)).data
    const newLesson = {
        id: course.lessons.length,
        title: form.title, description: form.description, task: form.task,
        materials: form.file ? [form.file.name] : []
    }
    const updated = [...course.lessons, newLesson]
    await coursesApi.updateCourse(course.id, {lessons: updated})
    alert(`Урок "${form.title}" успешно добавлен в программу курса!`)
    location.reload()
}
</script>

<template>
    <div class="modal fade" id="addLessonModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title w-100 text-center fw-bold">Новая тема курса</h5>
                    <button type="button" class="btn-close btn-close-white"
                            data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <form @submit.prevent="submit">
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Выберите курс</label>
                            <select v-model="form.courseId" class="form-select" required>
                                <option v-for="course in courses" :key="course.id"
                                        :value="course.id">
                                    {{ course.title }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Название урока</label>
                            <input v-model="form.title" type="text" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Описание урока</label>
                            <textarea v-model="form.description" class="form-control" rows="3"
                                      required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Практическое задание</label>
                            <textarea v-model="form.task" class="form-control" rows="2"
                                      required></textarea>
                        </div>
                        <div class="mb-4">
                            <label class="form-label small fw-bold">Прикрепить материал</label>
                            <input type="file" @change="e => form.file = e.target.files[0]"
                                   class="form-control">
                        </div>
                        <button type="submit" class="btn btn-primary w-100 fw-bold">Опубликовать
                            урок
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
