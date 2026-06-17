<script setup>
import {reactive, computed} from 'vue'
import {coursesApi} from '@/api'

const props = defineProps(['courses'])

const form = reactive({courseId: '', lessonIndex: 0, file: null})

const lessons = computed(() => {
    const course = props.courses.find(item => item.id === form.courseId)
    return course ? course.lessons : []
})

const submit = async () => {
    if (!form.file) {
        return alert("Пожалуйста, выберите файл")
    }
    const course = (await coursesApi.getById(form.courseId)).data
    course.lessons[form.lessonIndex].materials.push(form.file.name)
    await coursesApi.updateCourse(course.id, {lessons: course.lessons})
    alert(`Файл "${form.file.name}" успешно добавлен к уроку "${course.lessons[form.lessonIndex].title}"`)
    location.reload()
}
</script>

<template>
    <div class="modal fade" id="addMaterialModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold w-100 text-center">Новый материал</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <form @submit.prevent="submit">
                        <div class="mb-3">
                            <label class="form-label small">Выберите курс</label>
                            <select v-model="form.courseId" class="form-select" required>
                                <option v-for="course in courses" :key="course.id"
                                        :value="course.id">{{
                                        course.title
                                    }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small">Тема урока</label>
                            <select v-model="form.lessonIndex" class="form-select" required>
                                <option v-for="(lesson, idx) in lessons" :key="idx" :value="idx">{{
                                        lesson.title
                                    }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label class="form-label small">Файл</label>
                            <input type="file" @change="e => form.file = e.target.files[0]"
                                   class="form-control">
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Опубликовать</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
