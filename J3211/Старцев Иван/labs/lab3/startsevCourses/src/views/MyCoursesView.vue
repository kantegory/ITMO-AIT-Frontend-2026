<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import AppAlert from '@/components/AppAlert.vue'
import MyCourseCard from '@/components/MyCourseCard.vue'
import MyCoursesStats from '@/components/myCoursesStats.vue'
import { useAlert } from '@/composables/useAlert'
import { useCourses } from '@/composables/useCourses'
import { usePageMeta } from '@/composables/usePageMeta'
import { useCoursesStore } from '@/stores/courses'
import { useSessionStore } from '@/stores/session'

const sessionStore = useSessionStore()
const coursesStore = useCoursesStore()
const { myCourses, getCourseById } = useCourses()
const { alert: pageAlert, showAlert: showMessage, hideAlert: hideMessage } = useAlert()
const { setPageMeta } = usePageMeta()

const currentUser = computed(() => sessionStore.currentUser)

const courseModal = ref(null)
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

const studentsCount = computed(() =>
    myCourses.value.reduce((sum, course) => sum + course.studentsCount, 0),
)

const revenue = computed(() =>
    myCourses.value.reduce((sum, course) => sum + course.studentsCount * course.price, 0),
)

const stats = computed(() => [
    {
        title: 'Создано курсов',
        value: myCourses.value.length,
    },
    {
        title: 'Учеников на курсах',
        value: studentsCount.value,
    },
    {
        title: 'Выручка',
        value: `${revenue.value} ₽`,
    },
])

const modalTitle = computed(() =>
    editingCourseId.value ? 'Редактировать курс' : 'Создать курс',
)

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

const openCreateModal = () => {
    hideMessage()
    resetForm()
}

const openEditModal = (course) => {
    hideMessage()
    fillForm(course)
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

const handleSubmit = async () => {
    hideMessage()

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

        resetForm()

        const modal = window.bootstrap?.Modal.getOrCreateInstance(courseModal.value)

        if (modal) {
            modal.hide()
        }

        showMessage('success', isEditing ? 'Курс обновлен.' : 'Курс создан.')
    } catch {
        showMessage('danger', 'Не удалось сохранить курс.')
    }
}

onMounted(async () => {
    setPageMeta('Мои курсы', 'Управляйте созданными курсами, следите за количеством учеников и выручкой')

    try {
        await coursesStore.loadCourses()
        resetForm()
    } catch {
        showMessage('danger', coursesStore.error || 'Не удалось загрузить мои курсы.')
    }
})
</script>

<template>
    <main class="container pt-2 pb-4">
        <AppAlert
            :visible="pageAlert.visible"
            :type="pageAlert.type"
            :text="pageAlert.text"
            class="mb-3"
        />

        <div>
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <h1 class="h3 mb-0">Мои курсы</h1>

                <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#courseModal"
                    @click="openCreateModal"
                >
                    <svg class="default_svg" aria-hidden="true">
                        <use href="/sprites.svg#plusCircle"></use>
                    </svg>
                    Создать курс
                </button>
            </div>

            <div class="row g-3 mb-3">
                <div
                    v-for="stat in stats"
                    :key="stat.title"
                    class="col-12 col-md-4"
                >
                    <MyCoursesStats
                        :title="stat.title"
                        :value="stat.value"
                    />
                </div>
            </div>

            <AppAlert
                :visible="!myCourses.length"
                text="Пока нет созданных курсов."
            />

            <ul class="row g-3 list-unstyled">
                <li
                    v-for="course in myCourses"
                    :key="course.id"
                    class="col-12 col-sm-6 col-lg-4 col-xl-3"
                >
                    <MyCourseCard :course="course" @edit="openEditModal" />
                </li>
            </ul>
        </div>
    </main>

    <div
        id="courseModal"
        ref="courseModal"
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
                                    v-model="form.title"
                                    type="text"
                                    class="form-control"
                                    required
                                >
                            </div>

                            <div class="col-12">
                                <label for="courseDescriptionInput" class="form-label">Краткое описание</label>
                                <textarea
                                    id="courseDescriptionInput"
                                    v-model="form.description"
                                    class="form-control"
                                    rows="2"
                                    required
                                ></textarea>
                            </div>

                            <div class="col-12">
                                <label for="courseFullDescriptionInput" class="form-label">Подробное описание</label>
                                <textarea
                                    id="courseFullDescriptionInput"
                                    v-model="form.fullDescription"
                                    class="form-control"
                                    rows="3"
                                    required
                                ></textarea>
                            </div>

                            <div class="col-12 col-md-3">
                                <label for="coursePriceInput" class="form-label">Цена</label>
                                <input
                                    id="coursePriceInput"
                                    v-model="form.price"
                                    type="number"
                                    class="form-control"
                                    min="0"
                                    required
                                >
                            </div>

                            <div class="col-12 col-md-5">
                                <label for="courseLevelInput" class="form-label">Сложность</label>
                                <select
                                    id="courseLevelInput"
                                    v-model="form.level"
                                    class="form-select"
                                    required
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
                                    v-model="form.language"
                                    class="form-select"
                                    required
                                >
                                    <option value="Русский">Русский</option>
                                    <option value="Английский">Английский</option>
                                </select>
                            </div>

                            <div class="col-12 col-md-8">
                                <label for="courseImageInput" class="form-label">Ссылка на картинку</label>
                                <input
                                    id="courseImageInput"
                                    v-model="form.image"
                                    type="url"
                                    class="form-control"
                                    required
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
                                                        v-model="section.title"
                                                        type="text"
                                                        class="form-control"
                                                        required
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
                                                                v-model="lesson.title"
                                                                type="text"
                                                                class="form-control"
                                                                required
                                                            >
                                                        </label>
                                                    </div>

                                                    <div>
                                                        <label class="form-label w-100 mb-0">
                                                            <span class="d-block mb-1">Контент урока</span>
                                                            <textarea
                                                                v-model="lesson.content"
                                                                class="form-control"
                                                                rows="3"
                                                                required
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
