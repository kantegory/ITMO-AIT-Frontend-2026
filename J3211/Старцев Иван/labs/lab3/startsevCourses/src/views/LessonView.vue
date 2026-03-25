<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppAlert from '@/components/AppAlert.vue'
import { useCourses } from '@/composables/useCourses'
import { usePageMeta } from '@/composables/usePageMeta'
import { useCoursesStore } from '@/stores/courses'

const props = defineProps({
    id: {
        type: [String, Number],
        required: true,
    },
})

const router = useRouter()
const coursesStore = useCoursesStore()
const { getCourseById, isLearningCourse } = useCourses()
const { setPageMeta } = usePageMeta()

const courseId = Number(props.id)
const course = computed(() => getCourseById(courseId))
const errorText = ref('')

const state = reactive({
    section: 0,
    item: 0,
})

const currentSection = computed(() => {
    if (!course.value) {
        return null
    }

    return course.value.program[state.section] || null
})

const currentLesson = computed(() => {
    if (!currentSection.value) {
        return null
    }

    return currentSection.value.items[state.item] || null
})

const updatePageMeta = () => {
    if (!course.value) {
        return
    }
    setPageMeta(
        currentLesson.value ? currentLesson.value.title : 'Обучение',
        `Информация о курсе: ${course.value.title}`,
    )
}

const selectLesson = (sectionIndex, itemIndex) => {
    state.section = sectionIndex
    state.item = itemIndex
    updatePageMeta()
}

const isCurrentLesson = (sectionIndex, itemIndex) =>
    sectionIndex === state.section && itemIndex === state.item

const init = async () => {
    await coursesStore.loadCourses()

    if (!courseId || !isLearningCourse(courseId)) {
        await router.replace('/my-learning')
        return
    }

    if (!course.value) {
        errorText.value = 'Курс не найден.'
        setPageMeta('Обучение')
        return
    }

    updatePageMeta()
}

onMounted(async () => {
    try {
        await init()
    } catch {
        errorText.value = coursesStore.error || 'Не удалось загрузить урок.'
        setPageMeta('Обучение')
    }
})
</script>

<template>
    <main class="container-fluid pt-2 pb-3">
        <AppAlert v-if="errorText" type="danger" :text="errorText" />

        <div v-else-if="course" class="row g-3">
            <aside class="d-none d-lg-block col-lg-4 col-xl-3">
                <div class="card sticky-top z-0 overflow-auto lesson-page__sidebar">
                    <div
                        class="card-header sticky-top d-flex justify-content-between align-items-baseline"
                        style="background-color: var(--bs-secondary-bg);"
                    >
                        <h2 class="h6">Программа курса</h2>

                        <RouterLink
                            :to="{ name: 'course', params: { id: course.id } }"
                            class="btn btn-outline-dark btn-sm"
                        >
                            <svg class="default_svg" aria-hidden="true">
                                <use href="/sprites.svg#arrowLeft"></use>
                            </svg>
                            Назад
                        </RouterLink>
                    </div>

                    <div id="lessonsNav">
                        <nav aria-label="Уроки курса">
                            <section
                                v-for="(section, sectionIndex) in course.program"
                                :key="`${section.title}-${sectionIndex}`"
                                class="mb-3"
                            >
                                <h3 class="h6 mb-2 p-2">{{ section.title }}</h3>

                                <ul class="list-group">
                                    <li
                                        v-for="(item, itemIndex) in section.items"
                                        :key="`${item.title}-${itemIndex}`"
                                        class="list-group-item p-0"
                                    >
                                        <button
                                            type="button"
                                            :class="[
                                                'list-group-item',
                                                'list-group-item-action',
                                                isCurrentLesson(sectionIndex, itemIndex) ? 'active' : '',
                                            ]"
                                            :aria-current="isCurrentLesson(sectionIndex, itemIndex) ? 'location' : null"
                                            @click="selectLesson(sectionIndex, itemIndex)"
                                        >
                                            {{ itemIndex + 1 }}. {{ item.title }}
                                        </button>
                                    </li>
                                </ul>
                            </section>
                        </nav>
                    </div>
                </div>
            </aside>

            <section class="col-12 col-lg-8 col-xl-9">
                <div class="card">
                    <div class="card-body">
                        <div class="d-lg-none mb-3">
                            <button
                                type="button"
                                class="btn btn-outline-primary btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#lessonsModal"
                            >
                                <svg class="default_svg" aria-hidden="true">
                                    <use href="/sprites.svg#list"></use>
                                </svg>
                                <span class="ms-1">Выбрать урок</span>
                            </button>
                        </div>

                        <p class="text-muted mb-1">{{ course.title }}</p>
                        <h1 class="h4 mb-2">{{ currentLesson?.title }}</h1>
                        <p class="text-muted mb-4">{{ currentSection?.title }}</p>

                        <h2 class="h6">Материал</h2>
                        <p class="mb-3">{{ currentLesson?.content }}</p>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <div
        id="lessonsModal"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="lessonsModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="lessonsModalLabel" class="modal-title fs-5">Программа курса</h2>

                    <div class="ms-auto">
                        <RouterLink
                            v-if="course"
                            :to="{ name: 'course', params: { id: course.id } }"
                            class="btn btn-outline-dark btn-sm"
                        >
                            <svg class="default_svg" aria-hidden="true">
                                <use href="/sprites.svg#arrowLeft"></use>
                            </svg>
                            Назад
                        </RouterLink>
                    </div>

                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>

                <div class="modal-body">
                    <div v-if="course" id="lessonsNavMobile">
                        <nav aria-label="Уроки курса">
                            <section
                                v-for="(section, sectionIndex) in course.program"
                                :key="`mobile-${section.title}-${sectionIndex}`"
                                class="mb-3"
                            >
                                <h3 class="h6 mb-2 p-2">{{ section.title }}</h3>

                                <ul class="list-group">
                                    <li
                                        v-for="(item, itemIndex) in section.items"
                                        :key="`mobile-${item.title}-${itemIndex}`"
                                        class="list-group-item p-0"
                                    >
                                        <button
                                            type="button"
                                            data-bs-dismiss="modal"
                                            :class="[
                                                'list-group-item',
                                                'list-group-item-action',
                                                isCurrentLesson(sectionIndex, itemIndex) ? 'active' : '',
                                            ]"
                                            :aria-current="isCurrentLesson(sectionIndex, itemIndex) ? 'location' : null"
                                            @click="selectLesson(sectionIndex, itemIndex)"
                                        >
                                            {{ itemIndex + 1 }}. {{ item.title }}
                                        </button>
                                    </li>
                                </ul>
                            </section>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
