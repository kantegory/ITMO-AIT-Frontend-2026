<script setup>
import { computed, reactive, ref } from 'vue'
import { useCourses } from '@/composables/useCourses'
import { useCoursesStore } from '@/stores/courses'
import { useSessionStore } from '@/stores/session'

const emit = defineEmits(['create', 'err'])

const coursesStore = useCoursesStore()
const sessionStore = useSessionStore()
const { getCourseById } = useCourses()

const currentUser = computed(() => sessionStore.currentUser)
const modalElement = ref(null)
const editingCourseId = ref(null)

const getEmptyLesson = (title = 'Урок 1', content = '') => ({
    title,
    content,
})

const getEmptySection = (title = 'Раздел 1') => ({
    title,
    items: [getEmptyLesson()],
})

const form = reactive({
    title: '',
    description: '',
    fullDescription: '',
    price: '',
    level: 'Начальный',
    language: 'Русский',
    image: '',
    program: [getEmptySection()],
})

const modalTitle = computed(() =>
    editingCourseId.value ? 'Редактировать курс' : 'Создать курс',
)

const getModal = () => window.bootstrap?.Modal.getOrCreateInstance(modalElement.value)

const renumberProgram = () => {
    form.program.forEach((section, sectionIndex) => {
        if (/^Раздел \d+$/.test(section.title.trim())) {
            section.title = `Раздел ${sectionIndex + 1}`
        }

        section.items.forEach((item, itemIndex) => {
            if (/^Урок \d+$/.test(item.title.trim())) {
                item.title = `Урок ${itemIndex + 1}`
            }
        })
    })
}

const resetForm = () => {
    editingCourseId.value = null
    form.title = ''
    form.description = ''
    form.fullDescription = ''
    form.price = ''
    form.level = 'Начальный'
    form.language = 'Русский'
    form.image = ''
    form.program = [getEmptySection()]
}

const cloneProgram = (program = []) =>
    program.map((section) => ({
        title: section.title,
        items: section.items.map((item) => ({
            title: item.title,
            content: item.content,
        })),
    }))

const fillForm = (course) => {
    editingCourseId.value = course.id
    form.title = course.title
    form.description = course.description
    form.fullDescription = course.fullDescription
    form.price = course.price
    form.level = course.level
    form.language = course.language
    form.image = course.image
    form.program = cloneProgram(course.program.length ? course.program : [getEmptySection()])
}

const updateField = (field, value) => {
    form[field] = value
}

const updateSectionTitle = ({ sectionIndex, value }) => {
    form.program[sectionIndex].title = value
}

const updateLessonTitle = ({ sectionIndex, lessonIndex, value }) => {
    form.program[sectionIndex].items[lessonIndex].title = value
}

const updateLessonContent = ({ sectionIndex, lessonIndex, value }) => {
    form.program[sectionIndex].items[lessonIndex].content = value
}

const addSection = () => {
    const sectionNumber = form.program.length
    form.program.push(getEmptySection(`Раздел ${sectionNumber + 1}`))
}

const removeSection = (sectionIndex) => {
    if (form.program.length === 1) {
        return
    }

    form.program.splice(sectionIndex, 1)
    renumberProgram()
}

const addLesson = (sectionIndex) => {
    const section = form.program[sectionIndex]
    const lessonNumber = section.items.length
    section.items.push(getEmptyLesson(`Урок ${lessonNumber + 1}`))
}

const removeLesson = (sectionIndex, lessonIndex) => {
    const lessons = form.program[sectionIndex].items

    if (lessons.length === 1) {
        return
    }

    lessons.splice(lessonIndex, 1)
    renumberProgram()
}

const getProgram = () =>
    form.program.map((section) => ({
        title: section.title.trim(),
        items: section.items.map((item) => ({
            title: item.title.trim(),
            content: item.content.trim(),
        })),
    }))

const openCreate = () => {
    resetForm()
    getModal()?.show()
}

const openEdit = (course) => {
    fillForm(course)
    getModal()?.show()
}

const handleSubmit = async () => {
    const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        fullDescription: form.fullDescription.trim(),
        userId: currentUser.value.id,
        price: Number(form.price),
        level: form.level,
        language: form.language,
        image: form.image.trim(),
        program: getProgram(),
    }

    const isEditing = Boolean(editingCourseId.value)

    try {
        if (isEditing) {
            const currentCourse = getCourseById(editingCourseId.value)

            await coursesStore.updateCourse(editingCourseId.value, {
                ...payload,
                comments: currentCourse ? currentCourse.comments : [],
            })
        } else {
            const createdCourse = await coursesStore.createCourse({
                ...payload,
                comments: [],
            })

            await sessionStore.patchCurrentUser({
                createdCourseIds: [...currentUser.value.createdCourseIds, createdCourse.id],
            })
        }

        getModal()?.hide()
        resetForm()
        emit('create', isEditing ? 'Курс обновлен.' : 'Курс создан.')
    } catch {
        emit('err', 'Не удалось сохранить курс.')
    }
}

defineExpose({
    openCreate,
    openEdit,
})
</script>

<template>
    <div
        id="courseModal"
        ref="modalElement"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="courseModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="courseModalLabel" class="modal-title fs-5">{{ modalTitle }}</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>

                <div class="modal-body">
                    <form id="courseForm" @submit.prevent="handleSubmit">
                        <div class="row g-3">
                            <div class="col-12">
                                <label for="courseTitleInput" class="form-label">Название</label>
                                <input
                                    id="courseTitleInput"
                                    :value="form.title"
                                    type="text"
                                    class="form-control"
                                    required
                                    @input="updateField('title', $event.target.value)"
                                >
                            </div>

                            <div class="col-12">
                                <label for="courseDescriptionInput" class="form-label">Краткое описание</label>
                                <textarea
                                    id="courseDescriptionInput"
                                    :value="form.description"
                                    class="form-control"
                                    rows="2"
                                    required
                                    @input="updateField('description', $event.target.value)"
                                ></textarea>
                            </div>

                            <div class="col-12">
                                <label for="courseFullDescriptionInput" class="form-label">Подробное описание</label>
                                <textarea
                                    id="courseFullDescriptionInput"
                                    :value="form.fullDescription"
                                    class="form-control"
                                    rows="3"
                                    required
                                    @input="updateField('fullDescription', $event.target.value)"
                                ></textarea>
                            </div>

                            <div class="col-12 col-md-3">
                                <label for="coursePriceInput" class="form-label">Цена</label>
                                <input
                                    id="coursePriceInput"
                                    :value="form.price"
                                    type="number"
                                    class="form-control"
                                    min="0"
                                    required
                                    @input="updateField('price', $event.target.value)"
                                >
                            </div>

                            <div class="col-12 col-md-5">
                                <label for="courseLevelInput" class="form-label">Сложность</label>
                                <select
                                    id="courseLevelInput"
                                    :value="form.level"
                                    class="form-select"
                                    required
                                    @change="updateField('level', $event.target.value)"
                                >
                                    <option value="Начальный">Начальный</option>
                                    <option value="Средний">Средний</option>
                                    <option value="Продвинутый">Продвинутый</option>
                                </select>
                            </div>

                            <div class="col-12 col-md-4">
                                <label for="courseLanguageInput" class="form-label">Язык</label>
                                <select
                                    id="courseLanguageInput"
                                    :value="form.language"
                                    class="form-select"
                                    required
                                    @change="updateField('language', $event.target.value)"
                                >
                                    <option value="Русский">Русский</option>
                                    <option value="Английский">Английский</option>
                                </select>
                            </div>

                            <div class="col-12 col-md-8">
                                <label for="courseImageInput" class="form-label">Ссылка на картинку</label>
                                <input
                                    id="courseImageInput"
                                    :value="form.image"
                                    type="url"
                                    class="form-control"
                                    required
                                    @input="updateField('image', $event.target.value)"
                                >
                            </div>

                            <div class="col-12">
                                <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                                    <h3 class="h6 mb-0">Программа и контент курса</h3>
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-outline-primary"
                                        @click="addSection"
                                    >
                                        <svg class="default_svg" aria-hidden="true">
                                            <use href="/sprites.svg#plusCircle"></use>
                                        </svg>
                                        Добавить раздел
                                    </button>
                                </div>

                                <div class="d-grid gap-3">
                                    <div
                                        v-for="(section, sectionIndex) in form.program"
                                        :key="`section-${sectionIndex}`"
                                        class="card"
                                    >
                                        <div class="card-body">
                                            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                                                <h4 class="h6 mb-0">Раздел {{ sectionIndex + 1 }}</h4>

                                                <button
                                                    type="button"
                                                    class="btn btn-sm btn-outline-danger"
                                                    @click="removeSection(sectionIndex)"
                                                >
                                                    <svg class="default_svg" aria-hidden="true">
                                                        <use href="/sprites.svg#trash"></use>
                                                    </svg>
                                                    Удалить раздел
                                                </button>
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label w-100 mb-0">
                                                    <span class="d-block mb-1">Название раздела</span>
                                                    <input
                                                        :value="section.title"
                                                        type="text"
                                                        class="form-control"
                                                        required
                                                        @input="updateSectionTitle({
                                                            sectionIndex,
                                                            value: $event.target.value,
                                                        })"
                                                    >
                                                </label>
                                            </div>

                                            <div class="d-grid gap-2">
                                                <div
                                                    v-for="(lesson, lessonIndex) in section.items"
                                                    :key="`lesson-${sectionIndex}-${lessonIndex}`"
                                                    class="border rounded p-3"
                                                >
                                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                                        <h5 class="h6 mb-0">Урок {{ lessonIndex + 1 }}</h5>

                                                        <button
                                                            type="button"
                                                            class="btn btn-sm btn-outline-danger"
                                                            aria-label="Удалить урок"
                                                            @click="removeLesson(sectionIndex, lessonIndex)"
                                                        >
                                                            <svg class="default_svg" aria-hidden="true">
                                                                <use href="/sprites.svg#trash"></use>
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    <div class="mb-2">
                                                        <label class="form-label w-100">
                                                            <span class="d-block mb-1">Название урока</span>
                                                            <input
                                                                :value="lesson.title"
                                                                type="text"
                                                                class="form-control"
                                                                required
                                                                @input="updateLessonTitle({
                                                                    sectionIndex,
                                                                    lessonIndex,
                                                                    value: $event.target.value,
                                                                })"
                                                            >
                                                        </label>
                                                    </div>

                                                    <div>
                                                        <label class="form-label w-100 mb-0">
                                                            <span class="d-block mb-1">Контент урока</span>
                                                            <textarea
                                                                :value="lesson.content"
                                                                class="form-control"
                                                                rows="3"
                                                                required
                                                                @input="updateLessonContent({
                                                                    sectionIndex,
                                                                    lessonIndex,
                                                                    value: $event.target.value,
                                                                })"
                                                            ></textarea>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                class="btn btn-sm btn-outline-primary mt-2"
                                                @click="addLesson(sectionIndex)"
                                            >
                                                <svg class="default_svg" aria-hidden="true">
                                                    <use href="/sprites.svg#plusCircle"></use>
                                                </svg>
                                                Добавить урок
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        Отмена
                    </button>
                    <button type="submit" class="btn btn-primary" form="courseForm">
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
