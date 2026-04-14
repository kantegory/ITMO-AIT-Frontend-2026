<script setup>
import {reactive} from 'vue'
import {coursesApi} from '@/api'

const props = defineProps(['userId', 'userCourses'])
const emit = defineEmits(['success'])

const form = reactive({
    title: '', category: 'Программирование', level: 'Новичок',
    price: 5000, description: '', firstLesson: 'Введение и основы'
})

const submit = async () => {
    if (!form.title || !form.description) return alert("Заполните название и описание курса")

    const newCourseData = {
        title: form.title, category: form.category, level: form.level,
        price: form.price, studentsCount: 0, description: form.description,
        lessons: [{
            id: 0,
            title: form.firstLesson,
            description: `Добро пожаловать на первый урок курса ${form.title}!`,
            task: "Ознакомьтесь с материалами",
            materials: []
        }]
    }

    const res = await coursesApi.createCourse(newCourseData)
    if (res.data) {
        const updated = [...props.userCourses, res.data.id]
        await coursesApi.updateUser(props.userId, {courses: updated})
        alert(`Курс '${form.title}' успешно создан и опубликован!`)
        location.reload()
    }
}
</script>

<template>
    <div class="modal fade" id="createCourseModal" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title w-100 text-center fw-bold">Создание нового курса</h5>
                    <button type="button" class="btn-close btn-close-white"
                            data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <form @submit.prevent="submit">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label small fw-bold">Название курса</label>
                                <input v-model="form.title" type="text" class="form-control"
                                       placeholder="Основы C++" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label small fw-bold">Категория</label>
                                <select v-model="form.category" class="form-select">
                                    <option value="Программирование">Программирование</option>
                                    <option value="Дизайн">Дизайн</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label small fw-bold">Уровень</label>
                                <select v-model="form.level" class="form-select">
                                    <option value="Новичок">Новичок</option>
                                    <option value="Средний">Средний</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label small fw-bold">Цена (₽)</label>
                                <input v-model="form.price" type="number" class="form-control"
                                       required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Описание курса</label>
                            <textarea v-model="form.description" class="form-control" rows="3"
                                      placeholder="О чем этот курс?"></textarea>
                        </div>
                        <div class="p-3 bg-light rounded mb-4">
                            <h6 class="fw-bold mb-2 small text-primary">Первый урок</h6>
                            <label class="form-label small">Название вводного занятия</label>
                            <input v-model="form.firstLesson" type="text" class="form-control">
                        </div>
                        <button type="submit" class="btn btn-primary w-100 py-2 fw-bold">
                            Опубликовать курс на
                            платформе
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
