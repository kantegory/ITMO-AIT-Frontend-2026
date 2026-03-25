<script setup>
import { computed, onMounted, reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppAlert from '@/components/AppAlert.vue'
import CommentsList from '@/components/commentsList.vue'
import CreateCommentModal from '@/components/createCommentModal.vue'
import { useAlert } from '@/composables/useAlert'
import { useCourses } from '@/composables/useCourses'
import { usePageMeta } from '@/composables/usePageMeta'
import { useCoursesStore } from '@/stores/courses'
import { useSessionStore } from '@/stores/session'

const props = defineProps({
    id: {
        type: [String, Number],
        required: true,
    },
})

const router = useRouter()
const sessionStore = useSessionStore()
const coursesStore = useCoursesStore()
const { alert: message, showAlert: showMessage, hideAlert: hideMessage } = useAlert()
const { setPageMeta } = usePageMeta()

const currentUser = computed(() => sessionStore.currentUser)
const { getCourseById, usersById, isLearningCourse } = useCourses()

const courseId = Number(props.id)
const course = computed(() => getCourseById(courseId))

const commentForm = reactive({
    rating: '5',
    text: '',
})

const commentsWithAuthors = computed(() => {
    if (!course.value) {
        return []
    }

    return course.value.comments.map((comment) => ({
        ...comment,
        authorName: usersById.value.get(comment.userId)?.name || 'Неизвестный пользователь',
    }))
})

const currentComment = computed(() => {
    if (!course.value || !currentUser.value) {
        return null
    }

    return course.value.comments.find((comment) => comment.userId === currentUser.value.id) || null
})

const commentButtonVisible = computed(() => Boolean(currentUser.value))

const commentButtonText = computed(() =>
    currentComment.value ? 'Редактировать комментарий' : 'Оставить комментарий',
)

const submitCommentText = computed(() =>
    currentComment.value ? 'Сохранить' : 'Отправить',
)

const startLearningText = computed(() => {
    if (!course.value) {
        return 'Начать обучение'
    }

    if (!currentUser.value) {
        return 'Войти для обучения'
    }

    return isLearningCourse(course.value.id) ? 'Продолжить обучение' : 'Начать обучение'
})

const fillCommentForm = () => {
    if (currentComment.value) {
        commentForm.text = currentComment.value.text
        commentForm.rating = String(currentComment.value.rating)
        return
    }

    commentForm.text = ''
    commentForm.rating = '5'
}

const handleOpenCommentModal = () => {
    fillCommentForm()
}

const handleCommentSubmit = async () => {
    hideMessage()

    const nextComment = {
        userId: currentUser.value.id,
        rating: Number(commentForm.rating),
        text: commentForm.text.trim(),
    }

    const isEditing = Boolean(currentComment.value)
    const nextComments = isEditing
        ? course.value.comments.map((comment) =>
            comment.userId === currentUser.value.id ? nextComment : comment,
        )
        : [...course.value.comments, nextComment]

    try {
        await coursesStore.updateCourse(course.value.id, {
            comments: nextComments,
        })

        const modal = window.bootstrap?.Modal.getInstance(document.getElementById('commentModal'))

        if (modal) {
            modal.hide()
        }

        showMessage('success', isEditing ? 'Комментарий обновлен.' : 'Комментарий отправлен.')
    } catch {
        showMessage(
            'danger',
            isEditing ? 'Не удалось изменить комментарий.' : 'Не удалось отправить комментарий.',
        )
    }
}

const handleStartLearning = async () => {
    hideMessage()

    if (!currentUser.value) {
        await router.push('/login')
        return
    }

    if (isLearningCourse(course.value.id)) {
        await router.push({ name: 'lesson', params: { id: course.value.id } })
        return
    }

    try {
        await sessionStore.patchCurrentUser({
            learningCourseIds: [...currentUser.value.learningCourseIds, course.value.id],
        })

        await router.push({ name: 'lesson', params: { id: course.value.id } })
    } catch {
        showMessage('danger', 'Не удалось начать обучение.')
    }
}

const loadPage = async () => {
    await coursesStore.loadCourses()

    if (!course.value) {
        showMessage('danger', 'Курс не найден.')
        setPageMeta('Курс')
        return
    }

    setPageMeta(`Курс: ${course.value.title}`, `Информация о курсе: ${course.value.title}`)
}

onMounted(async () => {
    if (!courseId) {
        showMessage('danger', 'Курс не найден.')
        return
    }

    try {
        await loadPage()
    } catch {
        showMessage('danger', coursesStore.error || 'Не удалось загрузить курс.')
    }
})
</script>

<template>
    <main class="container pt-2 pb-4">
        <AppAlert
            :visible="message.visible"
            :type="message.type"
            :text="message.text"
            class="mb-3"
        />

        <div class="mb-3">
            <RouterLink to="/courses" class="btn btn-outline-dark btn-sm">
                <svg class="default_svg" aria-hidden="true">
                    <use href="/sprites.svg#arrowLeft"></use>
                </svg>
                Назад
            </RouterLink>
        </div>

        <div v-if="course">
            <div class="row g-4">
                <section class="col-12 col-lg-8">
                    <div class="card">
                        <img :src="course.image" :alt="course.title" class="card-img-top">
                        <div class="card-body">
                            <h1 class="h3 mb-3">{{ course.title }}</h1>
                            <p class="mb-0">{{ course.fullDescription || course.description }}</p>
                        </div>
                    </div>

                    <div class="card mt-4">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h2 class="h5 mb-0">Комментарии</h2>

                            <button
                                v-if="commentButtonVisible"
                                type="button"
                                class="btn btn-primary btn-sm px-2 px-sm-3"
                                data-bs-toggle="modal"
                                data-bs-target="#commentModal"
                                :aria-label="commentButtonText"
                                @click="handleOpenCommentModal"
                            >
                                <svg class="default_svg" aria-hidden="true">
                                    <use href="/sprites.svg#chat"></use>
                                </svg>
                                <span class="d-none d-sm-inline ms-1">{{ commentButtonText }}</span>
                            </button>
                        </div>

                        <div class="card-body">
                            <CommentsList :comments="commentsWithAuthors" />
                        </div>
                    </div>
                </section>

                <aside class="col-12 col-lg-4">
                    <div class="card sticky-top z-0 course-detail__info">
                        <div class="card-body">
                            <h2 class="h5 mb-3">О курсе</h2>

                            <dl class="mb-3">
                                <div class="mb-2">
                                    <dt class="mb-2"><strong>Автор:</strong></dt>
                                    <dd>{{ course.authorName }}</dd>
                                </div>

                                <div class="mb-2">
                                    <dt class="mb-2"><strong>Рейтинг:</strong></dt>
                                    <dd>
                                        <svg class="rating__star" aria-hidden="true">
                                            <use href="/sprites.svg#ratingStar"></use>
                                        </svg>
                                        {{ course.rating.toFixed(1) }} / 5
                                    </dd>
                                </div>

                                <div class="mb-2">
                                    <dt class="mb-2"><strong>Участники:</strong></dt>
                                    <dd>{{ course.studentsCount }} человек</dd>
                                </div>

                                <div class="mb-2">
                                    <dt class="mb-2"><strong>Уровень:</strong></dt>
                                    <dd>{{ course.level }}</dd>
                                </div>

                                <div class="mb-2">
                                    <dt class="mb-3"><strong>Язык:</strong></dt>
                                    <dd>{{ course.language }}</dd>
                                </div>
                            </dl>

                            <div class="d-flex align-items-center mb-3">
                                <span class="badge text-bg-primary fs-5">{{ course.price }} ₽</span>
                            </div>

                            <button
                                type="button"
                                class="btn btn-success w-100"
                                @click="handleStartLearning"
                            >
                                {{ startLearningText }}
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            <section class="mt-4">
                <div class="card">
                    <div class="card-header">
                        <h2 class="h5 mb-0">Программа курса</h2>
                    </div>

                    <div class="card-body">
                        <div id="programAccordion" class="accordion accordion-flush">
                            <div
                                v-for="(section, index) in course.program"
                                :key="`${section.title}-${index}`"
                                class="accordion-item"
                            >
                                <h2 :id="`programHeading${index}`" class="accordion-header">
                                    <button
                                        class="accordion-button"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        :data-bs-target="`#programSection${index}`"
                                        aria-expanded="true"
                                        :aria-controls="`programSection${index}`"
                                    >
                                        {{ section.title }}
                                    </button>
                                </h2>

                                <div
                                    :id="`programSection${index}`"
                                    class="accordion-collapse collapse show"
                                    :aria-labelledby="`programHeading${index}`"
                                >
                                    <div class="accordion-body">
                                        <ol class="mb-0 ps-3">
                                            <li
                                                v-for="(item, itemIndex) in section.items"
                                                :key="`${item.title}-${itemIndex}`"
                                                class="mb-2"
                                            >
                                                {{ item.title }}
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <CreateCommentModal
        :title="commentButtonText"
        :submit-text="submitCommentText"
        @submit="handleCommentSubmit"
        v-model:rating="commentForm.rating"
        v-model:text="commentForm.text"
    />

</template>
