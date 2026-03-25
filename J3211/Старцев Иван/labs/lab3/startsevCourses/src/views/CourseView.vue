<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { coursesApi, usersApi } from '@/api'
import { useSessionStore } from '@/stores/session'

const props = defineProps({
    id: {
        type: [String, Number],
        required: true,
    },
})

const router = useRouter()
const sessionStore = useSessionStore()

const currentUser = computed(() => sessionStore.currentUser)

const courseId = Number(props.id)
const course = ref(null)
const users = ref([])
const commentModal = ref(null)

const message = ref({
    type: '',
    text: '',
    visible: false,
})

const commentForm = reactive({
    rating: '5',
    text: '',
})

const showMessage = (type, text) => {
    message.value = {
        type,
        text,
        visible: true,
    }
}

const hideMessage = () => {
    message.value = {
        type: '',
        text: '',
        visible: false,
    }
}

const getUser = (userId) => users.value.find((item) => item.id === userId)

const getUserName = (userId) => {
    const user = getUser(userId)
    return user ? user.name : 'Неизвестный пользователь'
}

const getCourseRating = () => {
    if (!course.value || !course.value.comments.length) {
        return 0
    }

    const total = course.value.comments.reduce((sum, comment) => sum + comment.rating, 0)
    return total / course.value.comments.length
}

const getCourseStudents = () => {
    if (!course.value) {
        return 0
    }

    return users.value.filter((user) => user.learningCourseIds.includes(course.value.id)).length
}

const currentComment = computed(() => {
    if (!course.value || !currentUser.value) {
        return null
    }

    return course.value.comments.find(
        (comment) => comment.userId === currentUser.value.id,
    ) || null
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

    return currentUser.value.learningCourseIds.includes(course.value.id)
        ? 'Продолжить обучение'
        : 'Начать обучение'
})

const courseAuthorName = computed(() => {
    if (!course.value) {
        return 'Неизвестный автор'
    }

    const author = getUser(course.value.userId)
    return author ? author.name : 'Неизвестный автор'
})

const courseDescriptionText = computed(() => {
    if (!course.value) {
        return ''
    }

    return course.value.fullDescription || course.value.description
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

    if (!currentUser.value || !course.value) {
        await router.push('/login')
        return
    }

    const text = commentForm.text.trim()

    const nextComment = {
        userId: currentUser.value.id,
        rating: Number(commentForm.rating),
        text,
    }

    const isEditing = Boolean(currentComment.value)
    const nextComments = isEditing
        ? course.value.comments.map((comment) =>
            comment.userId === currentUser.value.id ? nextComment : comment,
        )
        : [...course.value.comments, nextComment]

    try {
        course.value = await coursesApi.update(course.value.id, {
            comments: nextComments,
        })

        const modal = window.bootstrap?.Modal.getInstance(commentModal.value)

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

    if (!currentUser.value || !course.value) {
        await router.push('/login')
        return
    }

    if (currentUser.value.learningCourseIds.includes(course.value.id)) {
        await router.push({ name: 'lesson', params: { id: course.value.id } })
        return
    }

    try {
        const updatedUser = await sessionStore.patchCurrentUser({
            learningCourseIds: [...currentUser.value.learningCourseIds, course.value.id],
        })

        if (!updatedUser) {
            showMessage('danger', 'Не удалось начать обучение.')
            return
        }

        await router.push({ name: 'lesson', params: { id: course.value.id } })
    } catch {
        showMessage('danger', 'Не удалось начать обучение.')
    }
}

const loadPage = async () => {
    course.value = await coursesApi.getById(courseId)
    users.value = await usersApi.getAll()

    document.title = `Курс${course.value.title ? `: ${course.value.title}` : ''}`

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
        metaDescription.setAttribute('content', `Информация о курсе: ${course.value.title}`)
    }
}

onMounted(async () => {
    if (!courseId) {
        showMessage('danger', 'Курс не найден.')
        return
    }

    try {
        await loadPage()
    } catch {
        showMessage('danger', 'Не удалось загрузить курс.')
    }
})
</script>

<template>
    <main class="container pt-2 pb-4">
        <div
            v-if="message.visible"
            :class="`alert alert-${message.type} mb-3`"
            role="alert"
        >
            {{ message.text }}
        </div>

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
                            <p class="mb-0">{{ courseDescriptionText }}</p>
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
                            <ul class="list-group list-group-flush">
                                <li
                                    v-if="!course.comments.length"
                                    class="list-group-item px-0 text-muted"
                                >
                                    Пока нет комментариев.
                                </li>

                                <li
                                    v-for="comment in course.comments"
                                    :key="comment.userId"
                                    class="list-group-item px-0"
                                >
                                    <article>
                                        <header class="d-flex justify-content-between gap-2">
                                            <strong>{{ getUserName(comment.userId) }}</strong>
                                            <span>
                        <svg class="rating__star" aria-hidden="true">
                          <use href="/sprites.svg#ratingStar"></use>
                        </svg>
                        {{ comment.rating }}/5
                      </span>
                                        </header>
                                        <p class="mb-0 mt-1">{{ comment.text }}</p>
                                    </article>
                                </li>
                            </ul>
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
                                    <dd>{{ courseAuthorName }}</dd>
                                </div>

                                <div class="mb-2">
                                    <dt class="mb-2"><strong>Рейтинг:</strong></dt>
                                    <dd>
                                        <svg class="rating__star" aria-hidden="true">
                                            <use href="/sprites.svg#ratingStar"></use>
                                        </svg>
                                        {{ getCourseRating().toFixed(1) }} / 5
                                    </dd>
                                </div>

                                <div class="mb-2">
                                    <dt class="mb-2"><strong>Участники:</strong></dt>
                                    <dd>{{ getCourseStudents() }} человек</dd>
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

    <div
        id="commentModal"
        ref="commentModal"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="commentModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="commentModalLabel" class="modal-title fs-5">
                        {{ commentButtonText }}
                    </h3>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>

                <div class="modal-body">
                    <form id="commentForm" @submit.prevent="handleCommentSubmit">
                        <div class="mb-3">
                            <label for="commentRating" class="form-label">Оценка</label>
                            <select id="commentRating" v-model="commentForm.rating" class="form-select" name="rating">
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                        </div>

                        <div>
                            <label for="commentText" class="form-label">Текст комментария</label>
                            <textarea
                                id="commentText"
                                v-model="commentForm.text"
                                class="form-control"
                                rows="4"
                                name="text"
                                placeholder="Напишите комментарий..."
                                required
                            ></textarea>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        Отмена
                    </button>
                    <button type="submit" class="btn btn-primary" form="commentForm">
                        {{ submitCommentText }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
